import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class ParamModele {
    @PrimaryColumn()
    uniqueName: string;

    @Column()
    viewName: string;

    @Column()
    value: string;
}