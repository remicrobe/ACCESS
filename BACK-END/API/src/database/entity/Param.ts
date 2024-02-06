import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Param {
    @PrimaryColumn()
    uniqueName: string;

    @Column()
    viewName: string;

    @Column()
    value: string;
}
