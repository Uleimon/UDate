/**
 * Austauschbare KI-Schnittstelle.
 *
 * Die App nutzt KI nur für klar abgegrenzte Aufgaben (Coach-Erklärungen, Gesprächseinstiege, Strukturieren
 * von Freitext-Begründungen im Kompass). Matching-Werte rechnet NIE die KI, sondern @udate/matching.
 *
 * Regeln für jeden Anbieter:
 * - Es gehen nur Daten raus, die der Nutzer für KI freigegeben hat (Consent AI_PROCESSING) und die das
 *   Gegenüber sichtbar gemacht hat. Keine E-Mail, kein Standort, keine Bilder, keine Ids.
 * - Die KI sendet nie selbst Nachrichten. Sie liefert nur Vorschläge, die der Nutzer selbst abschickt.
 * - Ist kein Anbieter eingerichtet, sagt die App das offen ("KI-Funktion noch nicht verfügbar") statt etwas vorzutäuschen.
 */

export type AiTask = 'coach_explain' | 'conversation_starters' | 'compass_note_aspects';

export interface ConversationStarterInput {
  /** Gemeinsamkeiten, die beide sichtbar gemacht haben, z. B. ["Gaming", "Reisen"] */
  sharedTopics: string[];
  /** Freigegebene Kurzbeschreibung des Gegenübers */
  otherBio: string | null;
  language: 'de';
}

export interface AiProvider {
  readonly name: string;
  readonly available: boolean;
  /** Warum nicht verfügbar (für die Anzeige), wenn available=false */
  readonly unavailableReason?: string;
  conversationStarters(input: ConversationStarterInput): Promise<string[]>;
}

export class AiUnavailableError extends Error {
  readonly code = 'ai_unavailable';
  constructor(reason: string) {
    super(reason);
  }
}

/** Standard: keine KI eingerichtet. Jede Anfrage scheitert ehrlich. */
export class DisabledAiProvider implements AiProvider {
  readonly name = 'none';
  readonly available = false;
  readonly unavailableReason = 'KI-Funktion noch nicht verfügbar. Es ist noch kein KI-Dienst angebunden.';
  async conversationStarters(): Promise<string[]> {
    throw new AiUnavailableError(this.unavailableReason);
  }
}

export function createAiProvider(kind: 'none' | 'anthropic'): AiProvider {
  switch (kind) {
    case 'none':
      return new DisabledAiProvider();
    case 'anthropic':
      // Kommt an Tag 16 (ROADMAP). Bis dahin lieber laut scheitern als still etwas Falsches tun.
      throw new Error('AI_PROVIDER=anthropic ist noch nicht implementiert (ROADMAP Tag 16). Bitte AI_PROVIDER=none setzen.');
  }
}
