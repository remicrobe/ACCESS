import {Collaborateur} from "./Collab";
import {Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Horaires} from "./Horaires";

@Entity()
export class Service {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Collaborateur)
    chefservice: Collaborateur;

    @Column()
    nomservice: string;

    @OneToMany(() => Collaborateur, collab => collab.service)
    collabs: Collaborateur[];
}