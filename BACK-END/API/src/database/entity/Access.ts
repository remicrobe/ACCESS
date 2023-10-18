import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Collaborateur} from "./Collab";

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

    @ManyToOne(() => Collaborateur, collaborateur => collaborateur.accesses)
    owner: Collaborateur;
}