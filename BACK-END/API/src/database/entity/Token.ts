import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Collaborateur} from "./Collab";

export enum tokenType{
    'appqrcode', 'cardqrcode', 'auth', 'recoverpassword'
}

@Entity()
export class Token {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Collaborateur, collaborateur => collaborateur.tokens)
    collab: Collaborateur;

    @Column({
        type: "enum",
        enum: tokenType
    })
    type: tokenType;

    @Column()
    actif: boolean;

    @Column()
    token: string;

    @CreateDateColumn({ type: 'timestamp' })
    datecreation: Date;
}