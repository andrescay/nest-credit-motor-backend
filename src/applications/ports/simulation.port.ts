export type SimulationOutcome = 'AVAILABLE' | 'NOT_VIABLE' | 'TECHNICAL_ERROR';

export interface SimulationResult {
    outcome: SimulationOutcome;
    detail: string;
    suggestedAmount?: number;
    suggestedRate?: number;
}

export interface SimulationPort {
    simulateOffer (input: {
        customerDocument: string;
        requestedAmount?: number;
    }) : Promise<SimulationResult>;
}