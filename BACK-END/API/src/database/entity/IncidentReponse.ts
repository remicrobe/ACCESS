import { Column, CreateDateColumn, Entity, ManyToOne } from "typeorm";
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

    @CreateDateColumn({select:true})
    creeLe: Date;
}