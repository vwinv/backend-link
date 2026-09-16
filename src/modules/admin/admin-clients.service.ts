import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, SubscriptionStatus, UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminClientsQueryDto } from './dto/admin-clients-query.dto';
import { UpdateAdminClientDto } from './dto/update-admin-client.dto';
import { validSubscriptionWhere } from '../subscriptions/subscription-validity';

@Injectable()
export class AdminClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: AdminClientsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      role: UserRole.USER,
      adminRoleId: null,
    };

    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    const search = query.search?.trim();
    if (search) {
      where.AND = [
        {
          OR: [
            { email: { contains: search, mode: 'insensitive' } },
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { phone: { contains: search, mode: 'insensitive' } },
          ],
        },
      ];
    }

    if (query.isPremium === true) {
      where.subscriptions = {
        some: validSubscriptionWhere({ offerId: { not: null } }),
      };
    } else if (query.isPremium === false) {
      where.subscriptions = {
        none: validSubscriptionWhere({ offerId: { not: null } }),
      };
    }

    const [total, users] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: this.listSelect(),
      }),
    ]);

    return {
      data: users.map((user) => this.toListItem(user)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
        role: UserRole.USER,
        adminRoleId: null,
      },
      select: {
        ...this.listSelect(),
        stripeCustomerId: true,
        businessCards: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' },
          take: 20,
          select: {
            id: true,
            slug: true,
            kind: true,
            firstName: true,
            lastName: true,
            jobTitle: true,
            company: true,
            isPublic: true,
            isActive: true,
            createdAt: true,
          },
        },
        subscriptions: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          select: {
            id: true,
            status: true,
            billingPeriod: true,
            currentPeriodEnd: true,
            createdAt: true,
            offer: {
              select: { id: true, title: true, slug: true, audience: true },
            },
            plan: { select: { id: true, name: true, slug: true } },
          },
        },
        teamMemberships: {
          take: 20,
          select: {
            role: true,
            team: {
              select: {
                id: true,
                name: true,
                slug: true,
                isActive: true,
              },
            },
          },
        },
        ownedTeams: {
          take: 20,
          select: {
            id: true,
            name: true,
            slug: true,
            isActive: true,
            _count: { select: { members: true } },
          },
        },
        _count: {
          select: {
            businessCards: true,
            teamMemberships: true,
            ownedTeams: true,
            contacts: true,
            shareEvents: true,
            cardViews: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Client introuvable');
    }

    const listItem = this.toListItem(user);

    return {
      ...listItem,
      stripeCustomerId: user.stripeCustomerId,
      cards: user.businessCards,
      subscriptions: user.subscriptions.map((sub) => ({
        id: sub.id,
        status: sub.status,
        billingPeriod: sub.billingPeriod,
        currentPeriodEnd: sub.currentPeriodEnd,
        createdAt: sub.createdAt,
        offer: sub.offer,
        plan: sub.plan,
      })),
      teams: user.teamMemberships.map((m) => ({
        role: m.role,
        ...m.team,
      })),
      ownedTeams: user.ownedTeams.map((team) => ({
        id: team.id,
        name: team.name,
        slug: team.slug,
        isActive: team.isActive,
        membersCount: team._count.members,
      })),
      stats: {
        cardsCount: user._count.businessCards,
        teamsCount: user._count.teamMemberships,
        ownedTeamsCount: user._count.ownedTeams,
        contactsCount: user._count.contacts,
        sharesCount: user._count.shareEvents,
        viewsCount: user._count.cardViews,
      },
    };
  }

  async update(id: string, dto: UpdateAdminClientDto) {
    if (
      dto.isActive === undefined &&
      dto.firstName === undefined &&
      dto.lastName === undefined &&
      dto.phone === undefined
    ) {
      throw new BadRequestException('Aucune modification fournie');
    }

    const existing = await this.prisma.user.findFirst({
      where: { id, role: UserRole.USER, adminRoleId: null },
      select: { id: true },
    });
    if (!existing) {
      throw new NotFoundException('Client introuvable');
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
        ...(dto.firstName !== undefined && {
          firstName: dto.firstName.trim(),
        }),
        ...(dto.lastName !== undefined && { lastName: dto.lastName.trim() }),
        ...(dto.phone !== undefined && {
          phone: dto.phone?.trim() || null,
        }),
      },
      select: this.listSelect(),
    });

    return this.toListItem(updated);
  }

  async remove(id: string) {
    const existing = await this.prisma.user.findFirst({
      where: { id, role: UserRole.USER, adminRoleId: null },
      select: { id: true, email: true },
    });
    if (!existing) {
      throw new NotFoundException('Client introuvable');
    }

    await this.prisma.user.delete({ where: { id } });

    return {
      message: 'Client supprimé',
      id: existing.id,
      email: existing.email,
    };
  }

  private listSelect() {
    return {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      avatarUrl: true,
      isActive: true,
      authProvider: true,
      createdAt: true,
      updatedAt: true,
      subscriptions: {
        where: validSubscriptionWhere({ offerId: { not: null } }),
        orderBy: { createdAt: 'desc' as const },
        take: 1,
        select: {
          id: true,
          status: true,
          billingPeriod: true,
          currentPeriodEnd: true,
          offer: {
            select: { title: true, slug: true, audience: true },
          },
        },
      },
      _count: {
        select: {
          businessCards: true,
          teamMemberships: true,
          ownedTeams: true,
        },
      },
    } satisfies Prisma.UserSelect;
  }

  private toListItem(
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      phone: string | null;
      avatarUrl: string | null;
      isActive: boolean;
      authProvider: string;
      createdAt: Date;
      updatedAt: Date;
      subscriptions: Array<{
        id: string;
        status: SubscriptionStatus;
        billingPeriod: string;
        currentPeriodEnd: Date | null;
        offer: {
          title: string;
          slug: string;
          audience: string;
        } | null;
      }>;
      _count: {
        businessCards: number;
        teamMemberships: number;
        ownedTeams: number;
      };
    },
  ) {
    const activeSub = user.subscriptions[0] ?? null;
    const isPremium = !!activeSub?.offer;

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      isActive: user.isActive,
      authProvider: user.authProvider,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isPremium,
      subscription: activeSub
        ? {
            id: activeSub.id,
            status: activeSub.status,
            billingPeriod: activeSub.billingPeriod,
            currentPeriodEnd: activeSub.currentPeriodEnd,
            offerTitle: activeSub.offer?.title ?? null,
            offerSlug: activeSub.offer?.slug ?? null,
            audience: activeSub.offer?.audience ?? null,
          }
        : null,
      cardsCount: user._count.businessCards,
      teamsCount: user._count.teamMemberships,
      ownedTeamsCount: user._count.ownedTeams,
    };
  }
}
