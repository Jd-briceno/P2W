import { Test, TestingModule } from '@nestjs/testing';
import { PacienteService } from './paciente.service';
import { Repository } from 'typeorm';
import { Paciente } from './paciente.entity';
import { Medico } from '../medico/medico.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';

describe('PacienteService', () => {
  let service: PacienteService;
  let pacienteRepository: Repository<Paciente>;
  let medicoRepository: Repository<Medico>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PacienteService,
        {
          provide: getRepositoryToken(Paciente),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Medico),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PacienteService>(PacienteService);
    pacienteRepository = module.get<Repository<Paciente>>(getRepositoryToken(Paciente));
    medicoRepository = module.get<Repository<Medico>>(getRepositoryToken(Medico));
  });

  it('should create a patient successfully', async () => {
    const paciente: Paciente = { id: '1', nombre: 'Juan', genero: 'M', medicos: [], diagnosticos: [] };
    jest.spyOn(pacienteRepository, 'save').mockResolvedValue(paciente);

    const result = await service.create(paciente);
    expect(result).toEqual(paciente);
  });

  it('should throw an error if patient name is less than 3 characters', async () => {
    const paciente: Paciente = { id: '2', nombre: 'Jo', genero: 'M', medicos: [], diagnosticos: [] };

    await expect(service.create(paciente)).rejects.toThrow(BadRequestException);
  });
});