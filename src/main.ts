import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { ThemeService } from './app/core/services/theme.service';

bootstrapApplication(AppComponent, appConfig).then(appRef => {
  const theme = appRef.injector.get(ThemeService);
  theme.init();
});
