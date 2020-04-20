export interface RawDataSample {
    agebracket: string,
    backupnotes: string,
    contractedfromwhichpatientsuspected: string,
    currentstatus: string,
    dateannounced: string,
    detectedcity: string,
    detecteddistrict: string,
    detectedstate: string,
    estimatedonsetdate: string,
    gender: string,
    nationality: string,
    notes: string,
    patientnumber: string,
    source1: string,
    source2: string,
    source3: string,
    statecode: string,
    statepatientnumber: string,
    statuschangedate: string,
    typeoftransmission: string,
}


export interface RawData {
    raw_data: Array<RawDataSample>,
}