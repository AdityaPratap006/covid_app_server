export interface LocationData {
    location: string, 
    caseCount: number,
}

export interface ResponseLocationObject {
    [key: string]: any,
}

export class StateData extends Map<string, Map<string, LocationData>> {
    

}

