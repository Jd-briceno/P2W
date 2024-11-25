import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paciente } from './paciente.entity';
import { Medico } from '../medico/medico.entity';
import { Diagnostico } from '../diagnostico/diagnostico.entity';

@Injectable()
export class PacienteService {
  constructor(
    @InjectRepository(Paciente)
    private readonly pacienteRepository: Repository<Paciente>,
    @InjectRepository(Medico)
    private readonly medicoRepository: Repository<Medico>,
    @InjectRepository(Diagnostico)
    private readonly diagnosticoRepository: Repository<Diagnostico>,
  ) {}

  async create(paciente: Paciente): Promise<Paciente> {
    if (paciente.nombre.length < 3) {
      throw new BadRequestException('El nombre del paciente debe tener al menos 3 caracteres');
    }
    return await this.pacienteRepository.save(paciente);
  }

  async findOne(id: string): Promise<Paciente> {
    const paciente = await this.pacienteRepository.findOne({
      where: { id },
      relations: ['diagnosticos', 'medicos'],
    });
    if (!paciente) {
      throw new NotFoundException('Paciente no encontrado');
    }
    return paciente;
  }

  async findAll(): Promise<Paciente[]> {
    return await this.pacienteRepository.find({ relations: ['diagnosticos', 'medicos'] });
  }

  async delete(id: string): Promise<void> {
    const paciente = await this.findOne(id);
    if (paciente.diagnosticos.length > 0) {
      throw new BadRequestException('No se puede eliminar un paciente con diagnósticos asociados');
    }
    await this.pacienteRepository.delete(id);
  }

  async addMedicoToPaciente(pacienteId: string, medicoId: string): Promise<void> {
    const paciente = await this.findOne(pacienteId);
    const medico = await this.medicoRepository.findOne({ where: { id: medicoId } });

    if (!medico) {
      throw new NotFoundException('Médico no encontrado');
    }

    if (paciente.medicos.length >= 5) {
      throw new BadRequestException('Un paciente no puede tener más de 5 médicos asignados');
    }

    paciente.medicos.push(medico);
    await this.pacienteRepository.save(paciente);
  }

  async addDiagnosticoToPaciente(pacienteId: string, diagnosticoId: string): Promise<void> {
    const paciente = await this.pacienteRepository.findOne({ where: { id: pacienteId }, relations: ['diagnosticos'] });
    if (!paciente) {
      throw new NotFoundException('Paciente no encontrado');
    }
  
    const diagnostico = await this.diagnosticoRepository.findOne({ where: { id: diagnosticoId } });
    if (!diagnostico) {
      throw new NotFoundException('Diagnóstico no encontrado');
    }
  
    if (paciente.diagnosticos.some((d) => d.id === diagnosticoId)) {
      throw new BadRequestException('El paciente ya tiene asignado este diagnóstico');
    }
  
    paciente.diagnosticos.push(diagnostico);
    await this.pacienteRepository.save(paciente);
  }  
}