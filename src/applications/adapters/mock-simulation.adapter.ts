import { Injectable } from "@nestjs/common";
import { SimulationPort, SimulationResult } from "../ports/simulation.port";


@Injectable()
export class MockSimulationAdapter implements SimulationPort {
    async simulateOffer (input: {
        customerDocument: string;
        requestedAmount?: number;
    }) : Promise<SimulationResult> {
        const tail = input.customerDocument.slice(-1);

        if (tail === '9' ){
            return{
                outcome: 'TECHNICAL_ERROR',
                detail: 'Temporary downstream timeout',
            }   
        }

        if (tail === '0' ){
            return{
                outcome: 'NOT_VIABLE',
                detail: 'Debt capacity does not allow a new credit',
            }   
        }

        return {
            outcome: 'AVAILABLE',
            detail: 'Preliminary offer available',
            suggestedAmount: input.requestedAmount ?? 5000,
            suggestedRate: Number((Math.random() * (5 - 1) + 1).toFixed(2)),
        }        
    }
    
}