import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Paciente } from '../paciente/paciente.entity';

@Entity()
export class Medico {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  especialidad: string;

  @Column()
  telefono: string;

  @OneToMany(() => Paciente, paciente => paciente.medicos, { cascade: true })
  pacientes: Paciente[];
}