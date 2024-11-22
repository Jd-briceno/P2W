import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medico } from './medico.entity';

@Injectable()
export class MedicoService {
  constructor(
    @InjectRepository(Medico)
    private readonly medicoRepository: Repository<Medico>,
  ) {}

  async create(medico: Medico): Promise<Medico> {
    if (!medico.nombre || !medico.especialidad) {
      throw new BadRequestException('Nombre y especialidad son obligatorios');
    }
    return await this.medicoRepository.save(medico);
  }

  async findOne(id: string): Promise<Medico> {
    const medico = await this.medicoRepository.findOne({
      where: { id },
      relations: ['pacientes'],
    });
    if (!medico) {
      throw new NotFoundException('Médico no encontrado');
    }
    return medico;
  }

  async findAll(): Promise<Medico[]> {
    return await this.medicoRepository.find({ relations: ['pacientes'] });
  }

  async delete(id: string): Promise<void> {
    const medico = await this.findOne(id);
    if (medico.pacientes.length > 0) {
      throw new BadRequestException('No se puede eliminar un médico con pacientes asociados');
    }
    await this.medicoRepository.delete(id);
  }
}