import { EnvironmentProviders, importProvidersFrom } from '@angular/core';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from '../services/in-memory-data.service';

export function provideInMemoryBackend(): EnvironmentProviders {
  return importProvidersFrom(
    HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, {
      delay: 500,
      passThruUnknownUrl: true // optional
    })
  );
}