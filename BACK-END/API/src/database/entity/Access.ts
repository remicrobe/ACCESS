import {Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Collaborateur} from "./Collab";
import {Service} from "./Service";

@Entity()
export class Access {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    macadress: string;

    @Column()
    location: string;

    @Column()
    nompoint: string;

    @Column()
    active: boolean;

    @Column()
    level: number;

    @ManyToMany(() => Collaborateur)
    @JoinTable()
    collabAutorise: Collaborateur[]

    @ManyToMany(() => Service)
    @JoinTable()
    serviceAutorise: Service[]
}