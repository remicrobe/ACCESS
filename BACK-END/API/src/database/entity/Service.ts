import { Collaborateur } from "./Collab";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Service {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Collaborateur, {nullable: true})
    @JoinColumn()
    chefservice: Collaborateur;

    @Column()
    nomservice: string;

    @OneToMany(() => Collaborateur, collab => collab.service, {nullable: true})
    collabs: Collaborateur[];
}
