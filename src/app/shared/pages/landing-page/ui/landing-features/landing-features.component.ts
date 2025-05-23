import { Component } from "@angular/core";

import { LucideAngularModule, ShieldHalf, Goal, Sparkles, ChartNoAxesCombined, BicepsFlexed, Brain } from "lucide-angular";

@Component({
  selector: 'gow-landing-features',
  imports: [LucideAngularModule],
  templateUrl: './landing-features.component.html'
})
export class LandingFeaturesComponent {
  public features = [
    {
      id: 1,
      title: 'Competencia por Equipos',
      description: 'Los estudiantes forman equipos secretos y compiten para eliminar a los oponentes usando habilidades obtenidas.',
      icon: ShieldHalf
    },
    {
      id: 2,
      title: 'Juegos Estratégico',
      description: 'Usa estrategia e ingenio para identificar a otros miembros del equipo y protegerte de ser eliminado.',
      icon: Goal
    },
    {
      id: 3,
      title: 'Sistema de habilidades',
      description: 'Completa tareas para ganar habilidades que te den ventajas en el juego.',
      icon: Sparkles
    },
    {
      id: 4,
      title: 'Seguimiento de Rendimiento',
      description: 'Gana o pierde puntos según tu desempeño en clase y asciende de nivel.',
      icon: ChartNoAxesCombined
    },
    {
      id: 5,
      title: 'Desarrollo de Habilidades',
      description: 'Mejora tus habilidades académicas mientras desarrollas el trabajo en equipo y el pensamiento estratégico.',
      icon: BicepsFlexed
    },
    {
      id: 6,
      title: 'Aprendizaje Atractivo',
      description: 'Transforma las experiencias en el aula con sistemas de motivación basados en juegos.',
      icon: Brain
    }
  ]
}
