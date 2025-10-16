import { z } from "zod";

export const formatName = (name: string): string => {
    return name
    .split(' ')
    .filter(word => word.length > 0)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const bookingSchema = z.object({
  cliente: z.preprocess(
    function (value) {
      if (typeof value === "string") {
        return value.replace(/\s+/g, " ")
      }
      return value
    },
    z
    .string()
    .trim() // 1. Remove espaços no início e no fim
    .min(6, { message: 'Nome completo deve ter no mínimo 3 caracteres.' })
    .max(36)
    // 2. Garante que há pelo menos um espaço (nome e sobrenome)
    .refine(name => name.includes(' '), {
        message: 'Por favor, insira seu nome completo.',
    })
    // 3. Garante que só há letras e espaços (incluindo acentos)
    .refine(name => /^[a-zA-Z\u00C0-\u017F\s'-]+$/.test(name), {
        message: 'Nome pode conter apenas letras e espaços.',
    })
    // 4. Transforma o nome para um formato padronizado (Capitaliza cada palavra)
    .transform(formatName),
  ),
  email: z.string().email({ message: 'Por favor, insira um email válido.' }),
  phone: z.preprocess(
    // 1 Pré-processamento: REMOVE tudo que nao for um digito (letras, espacos...)
    (val) => String(val).replace(/\D/g, ''),
    // 2 Validacao: aplica as regras apenas nos digitos que sobraram
    z.string()
      .min(10, { message: 'O telefone deve ter no mínimo 10 dígitos.' })
      .max(11, { message: 'O telefone deve ter no máximo 11 dígitos.' })
    // Validacao customizada para formatos brasileiros de telefone
    .refine(phone => {
      // Se tem 11 dígitos, precisa ser um celular (após o DDD inicia com 9)
      if (phone.length === 11) {
        return phone.substring(2).startsWith('9');
      }

      // Se tem 10 dígitos, precisa ser um fixo (NÃO pode iniciar com 9 após o DDD)
      if (phone.length === 10) {
        return !phone.substring(2).startsWith('9');
      }

      // Caso contrário, inválido
      return false;
    }, { message: 'Número de telefone inválido.'})
  ),
  notes: z.string().max(100, { message: 'Observação muito longa.' }).optional(),
});

export type BookingFormData = z.infer<typeof bookingSchema>;