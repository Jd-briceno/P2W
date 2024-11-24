import { Test, TestingModule } from '@nestjs/testing';
import { PacienteService } from './paciente.service';
import { Repository } from 'typeorm';
import { Paciente } from './paciente.entity';
import { Medico } from '../medico/medico.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

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

  // Pruebas para el método create
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

  // Pruebas para el método findOne
  it('should find a patient by ID successfully', async () => {
    const paciente: Paciente = { id: '1', nombre: 'Juan', genero: 'M', medicos: [], diagnosticos: [] };
    jest.spyOn(pacienteRepository, 'findOne').mockResolvedValue(paciente);

    const result = await service.findOne('1');
    expect(result).toEqual(paciente);
  });

  it('should throw an error if patient is not found by ID', async () => {
    jest.spyOn(pacienteRepository, 'findOne').mockResolvedValue(null);

    await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
  });

  // Pruebas para el método delete
  it('should delete a patient successfully', async () => {
    const paciente: Paciente = { id: '1', nombre: 'Juan', genero: 'M', medicos: [], diagnosticos: [] };
    jest.spyOn(service, 'findOne').mockResolvedValue(paciente);
    jest.spyOn(pacienteRepository, 'delete').mockResolvedValue(undefined);

    await expect(service.delete('1')).resolves.not.toThrow();
  });

  it('should throw an error if trying to delete a patient with diagnostics', async () => {
    const paciente: Paciente = { id: '1', nombre: 'Juan', genero: 'M', medicos: [], diagnosticos: [{ id: 'd1', nombre: 'Diagnostico', descripcion: 'Desc', paciente: null }] };
    jest.spyOn(service, 'findOne').mockResolvedValue(paciente);

    await expect(service.delete('1')).rejects.toThrow(BadRequestException);
  });

  // Pruebas para el método addMedicoToPaciente
  it('should add a medico to a patient successfully', async () => {
    const paciente: Paciente = { id: '1', nombre: 'Juan', genero: 'M', medicos: [], diagnosticos: [] };
    const medico: Medico = { id: 'm1', nombre: 'Dr. Smith', especialidad: 'Cardiología', telefono: '123456', pacientes: [] };
    jest.spyOn(service, 'findOne').mockResolvedValue(paciente);
    jest.spyOn(medicoRepository, 'findOne').mockResolvedValue(medico);
    jest.spyOn(pacienteRepository, 'save').mockResolvedValue(paciente);

    await expect(service.addMedicoToPaciente('1', 'm1')).resolves.not.toThrow();
  });

  it('should throw an error if adding a medico to a patient with 5 medicos already assigned', async () => {
    const medico: Medico = { id: 'm1', nombre: 'Dr. Smith', especialidad: 'Cardiología', telefono: '123456', pacientes: [] };
    const paciente: Paciente = { id: '1', nombre: 'Juan', genero: 'M', medicos: [medico, medico, medico, medico, medico], diagnosticos: [] };
    jest.spyOn(service, 'findOne').mockResolvedValue(paciente);
    jest.spyOn(medicoRepository, 'findOne').mockResolvedValue(medico);

    await expect(service.addMedicoToPaciente('1', 'm1')).rejects.toThrow(BadRequestException);
  });
});