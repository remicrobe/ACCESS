import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Collaborateur, typeCollab } from "./Collaborateur";
import { Service } from "./Service";
import { Historique } from "./Historique";

export enum typePoint {
    pointaccess = 'ap',
    pointeuse = 'pointeuse'
}

@Entity()
export class Access {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    macadress: string;

    @Column({
        type: "enum",
        enum: typePoint,
        default: typePoint.pointeuse
    })
    typePoint: typePoint;

    @Column()
    location: string;

    @Column()
    nompoint: string;

    @Column()
    active: boolean;

    @ManyToMany(() => Collaborateur)
    @JoinTable()
    collabAutorise: Collaborateur[];

    @ManyToMany(() => Service)
    @JoinTable()
    serviceAutorise: Service[];

    @OneToMany(() => Historique, hist => hist.collab)
    historique: Historique[];
}
