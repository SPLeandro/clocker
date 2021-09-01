import {ptBR} from 'date-fns/locale';
import { format } from 'date-fns';

export const formatDate = (date, pattern) => {
    return format(date, pattern, {locale: ptBR})
}