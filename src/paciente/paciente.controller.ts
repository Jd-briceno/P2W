import { Controller, Get, Post, Delete, Param, Body, BadRequestException, NotFoundException } from '@nestjs/common';
import { PacienteService } from './paciente.service';
import { Paciente } from './paciente.entity';

@Controller('pacientes')
export class PacienteController {
  constructor(private readonly pacienteService: PacienteService) {}

  @Post()
  async create(@Body() paciente: Paciente): Promise<Paciente> {
    try {
      return await this.pacienteService.create(paciente);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Paciente> {
    try {
      return await this.pacienteService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Get()
  async findAll(): Promise<Paciente[]> {
    return await this.pacienteService.findAll();
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    try {
      await this.pacienteService.delete(id);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Post(':pacienteId/medicos/:medicoId')
  async addMedicoToPaciente(@Param('pacienteId') pacienteId: string, @Param('medicoId') medicoId: string): Promise<void> {
    try {
      await this.pacienteService.addMedicoToPaciente(pacienteId, medicoId);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw error;
    }
  }

  @Post(':pacienteId/diagnosticos/:diagnosticoId')
  async addDiagnosticoToPaciente(
    @Param('pacienteId') pacienteId: string,
    @Param('diagnosticoId') diagnosticoId: string,
  ): Promise<void> {
    await this.pacienteService.addDiagnosticoToPaciente(pacienteId, diagnosticoId);
  }
}