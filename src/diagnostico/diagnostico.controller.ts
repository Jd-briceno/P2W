import { Controller, Get, Post, Delete, Param, Body, BadRequestException, NotFoundException } from '@nestjs/common';
import { DiagnosticoService } from './diagnostico.service';
import { Diagnostico } from './diagnostico.entity';

@Controller('diagnosticos')
export class DiagnosticoController {
  constructor(private readonly diagnosticoService: DiagnosticoService) {}

  @Post()
  async create(@Body() diagnostico: Diagnostico): Promise<Diagnostico> {
    try {
      return await this.diagnosticoService.create(diagnostico);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Diagnostico> {
    try {
      return await this.diagnosticoService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Get()
  async findAll(): Promise<Diagnostico[]> {
    return await this.diagnosticoService.findAll();
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    await this.diagnosticoService.delete(id);
  }
}