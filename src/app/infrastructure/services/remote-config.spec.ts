import { TestBed } from '@angular/core/testing';
import { RemoteConfig as FbRemoteConfig } from '@angular/fire/remote-config';
import { BehaviorSubject } from 'rxjs';
import { RemoteConfig } from './remote-config';

const mockFbRemoteConfig = {
  defaultConfig: {},
  settings: { minimumFetchIntervalMillis: 0, fetchTimeoutMillis: 60000 },
};

describe('RemoteConfig', () => {
  let service: RemoteConfig;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RemoteConfig,
        { provide: FbRemoteConfig, useValue: mockFbRemoteConfig },
      ],
    });

    service = TestBed.inject(RemoteConfig);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('showCategories$ should emit true by default', done => {
    service.showCategories$.subscribe(value => {
      expect(value).toBeTrue();
      done();
    });
  });
});
