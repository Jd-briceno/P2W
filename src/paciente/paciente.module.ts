import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paciente } from './paciente.entity';
import { Medico } from '../medico/medico.entity';
import { PacienteService } from './paciente.service';
import { PacienteController } from './paciente.controller';
import { MedicoModule } from '../medico/medico.module';
import { Diagnostico } from '../diagnostico/diagnostico.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Paciente, Medico, Diagnostico]),
    MedicoModule,
  ],
  providers: [PacienteService],
  controllers: [PacienteController],
  exports: [PacienteService],
})
export class PacienteModule {}