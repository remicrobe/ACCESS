import {Collaborateur} from "./Collab";
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Service {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    chefservice: number;

    @Column()
    nomservice: string;

    @ManyToOne(() => Collaborateur, collab => collab.services)
    collabs: Collaborateur;
}