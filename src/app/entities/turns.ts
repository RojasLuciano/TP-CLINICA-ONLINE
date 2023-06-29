import { Status } from "./status";

export class Turns {
    id?: string;
    name?: string;
    nameDate?: string;
    specialist?: string;
    specialistUid?: string;
    specialty?: string;
    patient?: string;
    patientUid?: string;
    date?: Date;
    day?: number;
    dayWeek?: number;
    month?: number;
    hour?: number;
    minutes?: number;
    poll?: string;
    rating?: number;
    status?: Status;
    commentCancel?: string;
    review?: string;
    //
    height?: number;
    weight?: number;
    temperature?: number;
    pressure?: number;
    name1?: string;
    value1?: string;
    name2?: string;
    value2?: string;
    name3?: string;
    value3?: string;
}
