/*
  # Données de démo pour Qualiopi

  ## Données créées
    - 1 tenant (Organisme de Formation démo)
    - Templates d'emails par défaut
    - Template de questionnaire à chaud
    - Template de questionnaire à froid
*/

-- ============================================================================
-- DEMO TENANT
-- ============================================================================

INSERT INTO tenants (id, name, siret, email, phone, address, settings_json)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'OF Démo Formation',
  '12345678901234',
  'contact@of-demo.fr',
  '0262123456',
  '123 Rue de la Formation, 97400 Saint-Denis',
  '{
    "qualiopi_certified": true,
    "default_email_from": "formation@of-demo.fr",
    "reminder_delays": {
      "hot_questionnaire": 7,
      "cold_questionnaire": 30
    }
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- DEFAULT EMAIL TEMPLATES
-- ============================================================================

-- Email de convocation
INSERT INTO email_templates (tenant_id, name, purpose, subject, body, status, version)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'Convocation Formation',
  'CONVOCATION',
  'Convocation - {{training_title}}',
  '<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <h2 style="color: #2563eb;">Convocation à la formation</h2>
  
  <p>Bonjour {{trainee_first_name}} {{trainee_last_name}},</p>
  
  <p>Nous vous confirmons votre inscription à la formation suivante :</p>
  
  <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3 style="margin-top: 0;">{{training_title}}</h3>
    <p><strong>Dates :</strong> Du {{start_date}} au {{end_date}}</p>
    <p><strong>Modalité :</strong> {{modality}}</p>
    <p><strong>Lieu :</strong> {{location}}</p>
    <p><strong>Formateur :</strong> {{trainer_name}}</p>
  </div>
  
  <p>Veuillez trouver en pièce jointe votre convocation officielle.</p>
  
  <p>Cordialement,<br>L''équipe de {{tenant_name}}</p>
</body>
</html>',
  'PUBLISHED',
  '1.0'
)
ON CONFLICT DO NOTHING;

-- Email questionnaire à chaud
INSERT INTO email_templates (tenant_id, name, purpose, subject, body, status, version)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'Invitation Questionnaire à Chaud',
  'HOT_INVITE',
  'Votre avis sur la formation {{training_title}}',
  '<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <h2 style="color: #2563eb;">Évaluation de votre formation</h2>
  
  <p>Bonjour {{trainee_first_name}} {{trainee_last_name}},</p>
  
  <p>Vous venez de terminer la formation <strong>{{training_title}}</strong>.</p>
  
  <p>Votre avis est très important pour nous aider à améliorer nos formations.</p>
  
  <p>Nous vous invitons à répondre à notre questionnaire de satisfaction (5 minutes) :</p>
  
  <div style="text-align: center; margin: 30px 0;">
    <a href="{{questionnaire_link}}" style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
      Répondre au questionnaire
    </a>
  </div>
  
  <p style="color: #666; font-size: 14px;">Ce lien est personnel et expire dans 30 jours.</p>
  
  <p>Merci de votre participation !</p>
  
  <p>Cordialement,<br>L''équipe de {{tenant_name}}</p>
</body>
</html>',
  'PUBLISHED',
  '1.0'
)
ON CONFLICT DO NOTHING;

-- Email questionnaire à froid
INSERT INTO email_templates (tenant_id, name, purpose, subject, body, status, version)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'Invitation Questionnaire à Froid',
  'COLD_INVITE',
  '30 jours après votre formation {{training_title}}',
  '<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <h2 style="color: #2563eb;">Bilan à 30 jours</h2>
  
  <p>Bonjour {{trainee_first_name}} {{trainee_last_name}},</p>
  
  <p>Il y a 30 jours, vous avez suivi notre formation <strong>{{training_title}}</strong>.</p>
  
  <p>Nous aimerions savoir si cette formation vous a été utile dans votre pratique professionnelle.</p>
  
  <p>Pouvez-vous prendre quelques minutes pour répondre à notre questionnaire de suivi ?</p>
  
  <div style="text-align: center; margin: 30px 0;">
    <a href="{{questionnaire_link}}" style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
      Répondre au questionnaire
    </a>
  </div>
  
  <p style="color: #666; font-size: 14px;">Ce lien est personnel et expire dans 30 jours.</p>
  
  <p>Merci de votre temps !</p>
  
  <p>Cordialement,<br>L''équipe de {{tenant_name}}</p>
</body>
</html>',
  'PUBLISHED',
  '1.0'
)
ON CONFLICT DO NOTHING;

-- Email de relance
INSERT INTO email_templates (tenant_id, name, purpose, subject, body, status, version)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'Relance Questionnaire',
  'REMINDER',
  'Rappel - Votre avis nous intéresse',
  '<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <h2 style="color: #f59e0b;">Rappel - Questionnaire en attente</h2>
  
  <p>Bonjour {{trainee_first_name}} {{trainee_last_name}},</p>
  
  <p>Nous avons remarqué que vous n''avez pas encore répondu à notre questionnaire concernant la formation <strong>{{training_title}}</strong>.</p>
  
  <p>Votre retour est précieux pour nous permettre d''améliorer la qualité de nos formations.</p>
  
  <div style="text-align: center; margin: 30px 0;">
    <a href="{{questionnaire_link}}" style="background: #f59e0b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
      Répondre maintenant
    </a>
  </div>
  
  <p style="color: #666; font-size: 14px;">Cela ne prendra que quelques minutes.</p>
  
  <p>Merci !</p>
  
  <p>Cordialement,<br>L''équipe de {{tenant_name}}</p>
</body>
</html>',
  'PUBLISHED',
  '1.0'
)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- DEFAULT QUESTIONNAIRE TEMPLATES
-- ============================================================================

-- Questionnaire à chaud
INSERT INTO questionnaire_templates (
  tenant_id, 
  name, 
  type, 
  status, 
  version,
  schema_json
)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'Questionnaire de Satisfaction à Chaud',
  'HOT',
  'PUBLISHED',
  '1.0',
  '{
    "title": "Évaluation de la formation",
    "description": "Merci de prendre quelques minutes pour évaluer la formation que vous venez de suivre.",
    "sections": [
      {
        "title": "Organisation",
        "questions": [
          {
            "id": "q1",
            "type": "likert",
            "question": "L''accueil et les conditions matérielles étaient satisfaisants",
            "required": true,
            "scale": 5
          },
          {
            "id": "q2",
            "type": "likert",
            "question": "La durée de la formation était adaptée",
            "required": true,
            "scale": 5
          }
        ]
      },
      {
        "title": "Contenu pédagogique",
        "questions": [
          {
            "id": "q3",
            "type": "likert",
            "question": "Les objectifs de la formation étaient clairement définis",
            "required": true,
            "scale": 5
          },
          {
            "id": "q4",
            "type": "likert",
            "question": "Le contenu répondait à vos attentes",
            "required": true,
            "scale": 5
          },
          {
            "id": "q5",
            "type": "likert",
            "question": "Les supports pédagogiques étaient de qualité",
            "required": true,
            "scale": 5
          }
        ]
      },
      {
        "title": "Animation",
        "questions": [
          {
            "id": "q6",
            "type": "likert",
            "question": "Le formateur était pédagogue et à l''écoute",
            "required": true,
            "scale": 5
          },
          {
            "id": "q7",
            "type": "likert",
            "question": "Les méthodes d''animation étaient variées et adaptées",
            "required": true,
            "scale": 5
          }
        ]
      },
      {
        "title": "Bilan global",
        "questions": [
          {
            "id": "q8",
            "type": "likert",
            "question": "Satisfaction globale sur cette formation",
            "required": true,
            "scale": 5
          },
          {
            "id": "q9",
            "type": "yesno",
            "question": "Recommanderiez-vous cette formation ?",
            "required": true
          },
          {
            "id": "q10",
            "type": "text",
            "question": "Commentaires et suggestions d''amélioration",
            "required": false,
            "multiline": true
          }
        ]
      }
    ]
  }'::jsonb
)
ON CONFLICT DO NOTHING;

-- Questionnaire à froid
INSERT INTO questionnaire_templates (
  tenant_id, 
  name, 
  type, 
  status, 
  version,
  schema_json
)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'Questionnaire de Suivi à Froid (J+30)',
  'COLD',
  'PUBLISHED',
  '1.0',
  '{
    "title": "Bilan à 30 jours",
    "description": "Un mois après votre formation, nous aimerions savoir si elle vous a été utile dans votre pratique professionnelle.",
    "sections": [
      {
        "title": "Application des acquis",
        "questions": [
          {
            "id": "q1",
            "type": "likert",
            "question": "Avez-vous pu mettre en pratique les compétences acquises ?",
            "required": true,
            "scale": 5
          },
          {
            "id": "q2",
            "type": "likert",
            "question": "La formation a-t-elle eu un impact positif sur votre travail ?",
            "required": true,
            "scale": 5
          },
          {
            "id": "q3",
            "type": "yesno",
            "question": "Avez-vous rencontré des difficultés pour appliquer les enseignements ?",
            "required": true
          },
          {
            "id": "q3_details",
            "type": "text",
            "question": "Si oui, lesquelles ?",
            "required": false,
            "multiline": true,
            "conditional": {
              "dependsOn": "q3",
              "showIf": "yes"
            }
          }
        ]
      },
      {
        "title": "Évolution professionnelle",
        "questions": [
          {
            "id": "q4",
            "type": "yesno",
            "question": "Cette formation a-t-elle contribué à une évolution dans votre poste ?",
            "required": true
          },
          {
            "id": "q5",
            "type": "text",
            "question": "Auriez-vous besoin d''un accompagnement complémentaire ?",
            "required": false,
            "multiline": true
          }
        ]
      },
      {
        "title": "Recommandations",
        "questions": [
          {
            "id": "q6",
            "type": "likert",
            "question": "Avec le recul, recommanderiez-vous cette formation ?",
            "required": true,
            "scale": 5
          },
          {
            "id": "q7",
            "type": "text",
            "question": "Autres commentaires",
            "required": false,
            "multiline": true
          }
        ]
      }
    ]
  }'::jsonb
)
ON CONFLICT DO NOTHING;
