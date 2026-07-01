import { ContactsService } from './contacts.service';
import { ExchangeContactDto } from './dto/exchange-contact.dto';
export declare class ContactsController {
    private readonly contactsService;
    constructor(contactsService: ContactsService);
    findAll(user: {
        userId: string;
    }): Promise<{
        id: string;
        source: import(".prisma/client").$Enums.ContactSource;
        fullName: string;
        initials: string;
        subtitle: string;
        email: string | null;
        phone: string | null;
        jobTitle: string | null;
        company: string | null;
        linkedCardId: string | null;
        avatarColor: number;
        addedAgo: string;
        sharedAgo: string;
        createdAt: string;
    }[]>;
    exchange(user: {
        userId: string;
    }, dto: ExchangeContactDto): Promise<{
        id: string;
        source: import(".prisma/client").$Enums.ContactSource;
        fullName: string;
        initials: string;
        subtitle: string;
        email: string | null;
        phone: string | null;
        jobTitle: string | null;
        company: string | null;
        linkedCardId: string | null;
        avatarColor: number;
        addedAgo: string;
        sharedAgo: string;
        createdAt: string;
    }>;
}
