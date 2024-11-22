import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diagnostico } from './diagnostico.entity';
import { DiagnosticoService } from './diagnostico.service';

@Module({
  imports: [TypeOrmModule.forFeature([Diagnostico])],
  providers: [DiagnosticoService],
  exports: [DiagnosticoService],
})
export class DiagnosticoModule {}
