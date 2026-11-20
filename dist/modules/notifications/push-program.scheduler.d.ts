import { PushProgramService } from './push-program.service';
export declare class PushProgramScheduler {
    private readonly pushProgramService;
    private readonly logger;
    constructor(pushProgramService: PushProgramService);
    tick(): Promise<void>;
}
