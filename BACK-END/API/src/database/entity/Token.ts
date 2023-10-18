import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Collaborateur} from "./Collab";

@Entity()
export class Token {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Collaborateur, collaborateur => collaborateur.tokens)
    collab: Collaborateur;

    @Column({
        type: "enum",
        enum: ['appqrcode', 'cardqrcode', 'auth']
    })
    type: string;

    @Column()
    actif: boolean;

    @Column()
    datecreation: Date;
}