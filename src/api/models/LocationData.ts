export interface LocationData {
    location: string, 
    caseCount: number,
} 

export class StateData extends Map<string, Map<string, LocationData>> {
    

}

