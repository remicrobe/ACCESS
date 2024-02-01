import { Column, Entity, ManyToOne } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm/decorator/columns/PrimaryGeneratedColumn";
import { Incident } from "./Incident";

@Entity()
export class IncidentReponse {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    reponse: string;

    @ManyToOne(() => Incident, inc => inc.reponse)
    incident: Incident;
}