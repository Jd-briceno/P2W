import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paciente } from './paciente.entity';
import { PacienteService } from './paciente.service';

@Module({
  imports: [TypeOrmModule.forFeature([Paciente])],
  providers: [PacienteService],
  exports: [PacienteService],
})
export class PacienteModule {}
