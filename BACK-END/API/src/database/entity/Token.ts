import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Collaborateur } from "./Collaborateur";

export enum tokenType {
    'appqrcode' = 'appqrcode',
    'cardqrcode' = "cardqrcode",
    'auth' = "auth",
    'recoverpassword' = "recoverpassword"
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

    @CreateDateColumn()
    datecreation: Date;
}
