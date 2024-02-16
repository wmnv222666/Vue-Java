import setLang from '../lang'

const lang = {
  i: {
    locale: 'fr-FR',
    select: {
      placeholder: 'Aucune donnée correspondante',
      noMatch: 'Aucun résultat',
      loading: 'Chargement'
    },
    table: {
      noDataText: 'Pas encore de données',
      noFilteredDataText: 'Aucun résultat de dépistage',
      confirmFilter: 'Dépistage',
      resetFilter: 'Réinitialiser',
      clearFilter: 'Tous'
    },
    datepicker: {
      selectDate: 'Sélectionnez la date',
      selectTime: 'Choisissez le temps',
      startTime: 'Heure de début',
      endTime: 'Heure de fin',
      clear: 'Annuler',
      ok: 'OK',
      datePanelLabel: '[mmmm] [yyyy]',
      month: 'Mois',
      month1: 'Janvier',
      month2: 'Février',
      month3: 'Mars',
      month4: 'Avril',
      month5: 'Mai',
      month6: 'Juin',
      month7: 'Juillet',
      month8: 'Août',
      month9: 'Septembre',
      month10: 'Octobre',
      month11: 'Novembre',
      month12: 'Decembre',
      year: 'An',
      weekStartDay: '1',
      weeks: {
        "thu": "Quatre",
        "tue": "Deux",
        "wed": "Trois",
        "sat": "Six",
        "fri": "Cinq",
        "sun": "Jour",
        "mon": "Un"
      },
      months: {
        "m1": "Janvier",
        "m2": "Février",
        "m3": "Mars",
        "m4": "Avril",
        "m5": "Mai",
        "m6": "Juin",
        "m7": "Juillet",
        "m8": "Août",
        "m9": "Septembre",
        "m11": "Novembre",
        "m10": "Octobre",
        "m12": "Décembre"
      }
    },
    transfer: {
      titles: {
        source: 'Source',
        target: 'Cible'
      },
      filterPlaceholder: 'Recherche',
      notFoundText: 'Pas de résultat'
    },
    modal: {
      okText: 'OK',
      cancelText: 'Annuler'
    },
    poptip: {
      okText: 'OK',
      cancelText: 'Annuler'
    },
    page: {
      prev: 'Page précédente',
      next: 'Page suivante',
      total: 'Total',
      item: "L'article",
      items: "L'article",
      prev5: '5 pages en avant',
      next5: '5 Pages en Arrière',
      page: 'Article / page',
      goto: 'Aller à',
      p: 'Page'
    },
    rate: {
      star: 'Étoile',
      stars: 'Étoiles'
    },
    tree: {
      emptyText: 'Aucune donnée'
    }
  }
}

setLang(lang)

export default lang
