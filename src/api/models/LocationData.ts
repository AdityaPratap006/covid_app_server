export interface Coordinates {
    latitude: number,
    longitude: number,
}

export interface LocationData {
    state: string,
    location: string, 
    caseCount: number,
    coordinates: Coordinates,
}

export interface ResponseLocationObject {
    [key: string]: any,
}

export class StateData extends Map<string, Map<string, LocationData>> {
    

}

