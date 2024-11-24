import { Test, TestingModule } from '@nestjs/testing';
import { DiagnosticoService } from './diagnostico.service';
import { Repository } from 'typeorm';
import { Diagnostico } from './diagnostico.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('DiagnosticoService', () => {
  let service: DiagnosticoService;
  let diagnosticoRepository: Repository<Diagnostico>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiagnosticoService,
        {
          provide: getRepositoryToken(Diagnostico),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DiagnosticoService>(DiagnosticoService);
    diagnosticoRepository = module.get<Repository<Diagnostico>>(getRepositoryToken(Diagnostico));
  });

  it('should create a diagnostico successfully', async () => {
    const diagnostico: Diagnostico = { id: '1', nombre: 'Dolor de cabeza', descripcion: 'Dolor persistente', paciente: null };
    jest.spyOn(diagnosticoRepository, 'save').mockResolvedValue(diagnostico);

    const result = await service.create(diagnostico);
    expect(result).toEqual(diagnostico);
  });

  it('should throw an error if diagnostico description exceeds 200 characters', async () => {
    const descripcionLarga = 'a'.repeat(201);
    const diagnostico: Diagnostico = { id: '2', nombre: 'Dolor de cabeza', descripcion: descripcionLarga, paciente: null };

    await expect(service.create(diagnostico)).rejects.toThrow(BadRequestException);
  });

  it('should find a diagnostico by ID successfully', async () => {
    const diagnostico: Diagnostico = { id: '1', nombre: 'Dolor de cabeza', descripcion: 'Dolor persistente', paciente: null };
    jest.spyOn(diagnosticoRepository, 'findOne').mockResolvedValue(diagnostico);

    const result = await service.findOne('1');
    expect(result).toEqual(diagnostico);
  });

  it('should throw an error if diagnostico is not found by ID', async () => {
    jest.spyOn(diagnosticoRepository, 'findOne').mockResolvedValue(null);

    await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
  });

  it('should delete a diagnostico successfully', async () => {
    const diagnostico: Diagnostico = { id: '1', nombre: 'Dolor de cabeza', descripcion: 'Dolor persistente', paciente: null };
    jest.spyOn(diagnosticoRepository, 'findOne').mockResolvedValue(diagnostico);
    jest.spyOn(diagnosticoRepository, 'delete').mockResolvedValue(undefined);

    await expect(service.delete('1')).resolves.not.toThrow();
  });
});