import { TestBed } from '@angular/core/testing';
import { Storage } from '@ionic/storage-angular';
import { StorageService } from './storage';

describe('StorageService', () => {
  let service: StorageService;
  let mockStorage: jasmine.SpyObj<Storage>;

  beforeEach(() => {
    mockStorage = jasmine.createSpyObj('Storage', ['create', 'get', 'set', 'remove']);
    mockStorage.create.and.returnValue(Promise.resolve(mockStorage));
    mockStorage.get.and.returnValue(Promise.resolve(null));
    mockStorage.set.and.returnValue(Promise.resolve());
    mockStorage.remove.and.returnValue(Promise.resolve());

    TestBed.configureTestingModule({
      providers: [
        StorageService,
        { provide: Storage, useValue: mockStorage },
      ],
    });

    service = TestBed.inject(StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('get should initialize storage on first call', async () => {
    await service.get('key');
    expect(mockStorage.create).toHaveBeenCalledTimes(1);
  });

  it('get should not initialize storage on second call', async () => {
    await service.get('key');
    await service.get('key');
    expect(mockStorage.create).toHaveBeenCalledTimes(1);
  });

  it('get should return value from storage', async () => {
    mockStorage.get.and.returnValue(Promise.resolve('test-value'));
    const result = await service.get('key');
    expect(result).toBe('test-value');
  });

  it('set should store value', async () => {
    await service.set('key', 'value');
    expect(mockStorage.set).toHaveBeenCalledWith('key', 'value');
  });

  it('remove should delete key', async () => {
    await service.remove('key');
    expect(mockStorage.remove).toHaveBeenCalledWith('key');
  });
});
