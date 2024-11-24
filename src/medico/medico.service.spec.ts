import { Test, TestingModule } from '@nestjs/testing';
import { MedicoService } from './medico.service';
import { Repository } from 'typeorm';
import { Medico } from './medico.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Paciente } from '../paciente/paciente.entity';

describe('MedicoService', () => {
  let service: MedicoService;
  let medicoRepository: Repository<Medico>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicoService,
        {
          provide: getRepositoryToken(Medico),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MedicoService>(MedicoService);
    medicoRepository = module.get<Repository<Medico>>(getRepositoryToken(Medico));
  });

  it('should create a medico successfully', async () => {
    const medico: Medico = { id: '1', nombre: 'Dr. Smith', especialidad: 'Cardiología', telefono: '123456', pacientes: [] };
    jest.spyOn(medicoRepository, 'save').mockResolvedValue(medico);

    const result = await service.create(medico);
    expect(result).toEqual(medico);
  });

  it('should throw an error if medico name or specialty is missing', async () => {
    const medico: Medico = { id: '2', nombre: '', especialidad: '', telefono: '123456', pacientes: [] };

    await expect(service.create(medico)).rejects.toThrow(BadRequestException);
  });

  it('should find a medico by ID successfully', async () => {
    const medico: Medico = { id: '1', nombre: 'Dr. Smith', especialidad: 'Cardiología', telefono: '123456', pacientes: [] };
    jest.spyOn(medicoRepository, 'findOne').mockResolvedValue(medico);

    const result = await service.findOne('1');
    expect(result).toEqual(medico);
  });

  it('should throw an error if medico is not found by ID', async () => {
    jest.spyOn(medicoRepository, 'findOne').mockResolvedValue(null);

    await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
  });

  it('should delete a medico successfully', async () => {
    const medico: Medico = { id: '1', nombre: 'Dr. Smith', especialidad: 'Cardiología', telefono: '123456', pacientes: [] };
    jest.spyOn(service, 'findOne').mockResolvedValue(medico);
    jest.spyOn(medicoRepository, 'delete').mockResolvedValue(undefined);

    await expect(service.delete('1')).resolves.not.toThrow();
  });

  it('should throw an error if trying to delete a medico with patients', async () => {
    const medico: Medico = { id: '1', nombre: 'Dr. Smith', especialidad: 'Cardiología', telefono: '123456', pacientes: [{} as Paciente] };
    jest.spyOn(service, 'findOne').mockResolvedValue(medico);

    await expect(service.delete('1')).rejects.toThrow(BadRequestException);
  });
});