<template>
  <div class="uk-section uk-section-default">
    <div class="uk-container">
      <!-- Header -->
      <div class="uk-text-center uk-margin-large-bottom">
        <h1 class="uk-heading-primary">
          🎭 Festivals Français
        </h1>
        <p class="uk-text-large uk-text-muted">
          Découvrez les festivals culturels en France
        </p>
      </div>

      <!-- Barre d'actions -->
      <div class="uk-margin-medium-bottom">
        <div class="uk-card uk-card-default uk-card-body">
          <div class="uk-grid-small uk-flex-middle uk-flex-between" uk-grid>
            <div class="uk-width-auto">
              <div class="uk-button-group">
                <button 
                  @click="() => fetchFestivals(1)" 
                  class="uk-button uk-button-primary"
                  :disabled="loading"
                >
                  <span v-if="loading" uk-spinner="ratio: 0.5" class="uk-margin-small-right"></span>
                  <span uk-icon="refresh" class="uk-margin-small-right" v-if="!loading"></span>
                  {{ loading ? 'Chargement...' : 'Actualiser' }}
                </button>
                
                <button 
                  @click="() => testApiConnection()" 
                  class="uk-button uk-button-secondary"
                  :disabled="loading"
                >
                  <span uk-icon="search" class="uk-margin-small-right"></span>
                  Test API
                </button>
                
                <button 
                  @click="showLogs = !showLogs" 
                  class="uk-button uk-button-default"
                >
                  <span uk-icon="list" class="uk-margin-small-right"></span>
                  {{ showLogs ? 'Masquer' : 'Voir' }} Logs
                </button>
              </div>
            </div>
            
            <div class="uk-width-auto" v-if="totalCount > 0">
              <span class="uk-badge uk-background-primary">{{ totalCount }}</span>
              <span class="uk-text-meta uk-margin-small-left">festivals disponibles</span>
              <span v-if="searchTerm" class="uk-label uk-label-warning uk-margin-small-left">
                <span uk-icon="search" class="uk-margin-small-right"></span>
                "{{ searchTerm }}"
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtres -->
      <div v-if="festivals.length > 0" class="uk-margin-medium-bottom">
        <div class="uk-card uk-card-default uk-card-body">
          <h3 class="uk-card-title">
            <span uk-icon="settings" class="uk-margin-small-right"></span>
            Filtres et recherche
          </h3>
          
          <div class="uk-grid-small uk-grid-match" uk-grid>
            <!-- Recherche -->
            <div class="uk-width-1-2@s uk-width-1-3@m">
              <label class="uk-form-label">
                <span uk-icon="search" class="uk-margin-small-right"></span>
                Recherche
              </label>
              <div class="uk-inline uk-width-1-1">
                <input 
                  v-model="searchTerm" 
                  @keyup.enter="searchFestivals"
                  @input="onSearchInput"
                  type="text" 
                  placeholder="Nom du festival..."
                  class="uk-input"
                >
                <button 
                  v-if="searchTerm" 
                  @click="clearSearch"
                  class="uk-form-icon uk-form-icon-flip"
                  type="button"
                >
                  <span uk-icon="close"></span>
                </button>
              </div>
              <button 
                @click="searchFestivals"
                class="uk-button uk-button-primary uk-button-small uk-width-1-1 uk-margin-small-top"
                :disabled="!searchTerm.trim()"
              >
                <span uk-icon="search" class="uk-margin-small-right"></span>
                Rechercher
              </button>
            </div>

            <!-- Région -->
            <div class="uk-width-1-2@s uk-width-1-3@m">
              <label class="uk-form-label">
                <span uk-icon="location" class="uk-margin-small-right"></span>
                Région
              </label>
              <select v-model="filterRegion" @change="filterFestivals" class="uk-select">
                <option value="">Toutes les régions</option>
                <option v-for="region in uniqueRegions" :key="region" :value="region">
                  {{ region }}
                </option>
              </select>
            </div>

            <!-- Discipline -->
            <div class="uk-width-1-1@s uk-width-1-3@m">
              <label class="uk-form-label">
                <span uk-icon="tag" class="uk-margin-small-right"></span>
                Discipline
              </label>
              <select v-model="filterDiscipline" @change="filterFestivals" class="uk-select">
                <option value="">Toutes les disciplines</option>
                <option v-for="discipline in uniqueDisciplines" :key="discipline" :value="discipline">
                  {{ discipline }}
                </option>
              </select>
            </div>
          </div>

          <!-- Info pagination -->
          <div class="uk-margin-small-top uk-text-center" v-if="totalCount > 0">
            <div class="uk-grid-small uk-flex-middle uk-flex-center" uk-grid>
              <div>
                <span class="uk-text-meta">
                  Page {{ currentPage }} - {{ startIndex }} à {{ endIndex }} sur {{ totalCount }} résultats
                </span>
              </div>
              <div>
                <select v-model="itemsPerPage" @change="changeItemsPerPage" class="uk-select uk-form-small uk-form-width-small">
                  <option value="10">10 par page</option>
                  <option value="20">20 par page</option>
                  <option value="50">50 par page</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

    <!-- Affichage des logs -->
    <div v-if="showLogs" class="uk-margin">
      <div class="uk-card uk-card-default">
        <div class="uk-card-header">
          <div class="uk-grid-small uk-flex-middle" uk-grid>
            <div class="uk-width-expand">
              <h3 class="uk-card-title uk-margin-remove-bottom">
                <span uk-icon="list" class="uk-margin-small-right"></span>
                Logs de débogage
              </h3>
            </div>
            <div class="uk-width-auto">
              <button @click="clearLogs" class="uk-button uk-button-danger uk-button-small">
                <span uk-icon="trash" class="uk-margin-small-right"></span>
                Vider
              </button>
            </div>
          </div>
        </div>
        <div class="uk-card-body uk-background-muted">
          <div class="logs-container uk-background-secondary uk-light uk-padding-small" v-if="logs.length > 0">
            <div 
              v-for="(log, index) in logs.slice(-10)" 
              :key="index"
              class="log-entry"
              :class="`log-${log.level.toLowerCase()}`"
            >
              <span class="log-time">{{ formatLogTime(log.timestamp) }}</span>
              <span class="log-level">{{ log.level }}</span>
              <span class="log-message">{{ log.message }}</span>
              <pre v-if="log.data" class="log-data">{{ JSON.stringify(log.data, null, 2) }}</pre>
            </div>
          </div>
          <p v-else class="uk-text-muted">Aucun log disponible</p>
        </div>
      </div>
    </div>

    <!-- Affichage des erreurs -->
    <div v-if="error" class="uk-alert-danger uk-margin" uk-alert>
      <a class="uk-alert-close" uk-close></a>
      <p>Erreur lors du chargement : {{ error }}</p>
    </div>

    <!-- Affichage des festivals -->
    <div v-if="filteredFestivals.length > 0" class="uk-margin-large-top">
      <div class="uk-flex uk-flex-middle uk-flex-between uk-margin-medium-bottom">
        <h2 class="uk-heading-bullet uk-margin-remove">
          <span uk-icon="happy" class="uk-margin-small-right"></span>
          {{ filteredFestivals.length }} festivals trouvés
        </h2>
        <div v-if="loading">
          <span class="uk-margin-small-right" uk-spinner></span>
          <span class="uk-text-meta">Chargement...</span>
        </div>
      </div>
      
      <div class="uk-child-width-1-1@s uk-child-width-1-2@m uk-child-width-1-3@xl uk-grid-match" uk-grid>
        <div v-for="festival in filteredFestivals" :key="festival.identifiant">
          <div class="uk-card uk-card-default uk-card-hover uk-card-small">
            <!-- Header -->
            <div class="uk-card-header uk-background-muted">
              <div class="uk-grid-small uk-flex-middle" uk-grid>
                <div class="uk-width-expand">
                  <h3 class="uk-card-title uk-margin-remove-bottom uk-text-truncate">
                    <span uk-icon="star" class="uk-margin-small-right uk-text-warning"></span>
                    {{ festival.nom_du_festival }}
                  </h3>
                  <p class="uk-text-meta uk-margin-remove-top">
                    <span uk-icon="location" class="uk-margin-small-right"></span> 
                    {{ festival.commune_principale_de_deroulement }}
                    <span v-if="festival.region_principale_de_deroulement" class="uk-text-muted">
                      • {{ festival.region_principale_de_deroulement }}
                    </span>
                  </p>
                </div>
                <div class="uk-width-auto">
                  <span class="uk-label uk-label-success" v-if="festival.discipline_dominante">
                    {{ festival.discipline_dominante }}
                  </span>
                </div>
              </div>
            </div>
            
            <!-- Body -->
            <div class="uk-card-body uk-card-small">
              <!-- Période -->
              <div class="uk-grid-small uk-margin-small" uk-grid>
                <div class="uk-width-1-1" v-if="festival.periode_principale_de_deroulement_du_festival">
                  <div class="uk-flex uk-flex-middle">
                    <span uk-icon="calendar" class="uk-margin-small-right uk-text-muted"></span>
                    <span class="uk-text-small uk-text-emphasis">
                      {{ festival.periode_principale_de_deroulement_du_festival }}
                    </span>
                  </div>
                </div>
                
                <div class="uk-width-1-2" v-if="festival.annee_de_creation_du_festival && festival.annee_de_creation_du_festival !== '01/01/1998 00:00' && festival.annee_de_creation_du_festival !== '01/01/2011 00:00' && festival.annee_de_creation_du_festival !== '01/01/2015 00:00' && festival.annee_de_creation_du_festival !== '01/01/2016 00:00'">
                  <span class="uk-label uk-label-warning">
                    <span uk-icon="history" class="uk-margin-small-right"></span>
                    {{ festival.annee_de_creation_du_festival }}
                  </span>
                </div>
                <div class="uk-width-1-2" v-else-if="festival.decennie_de_creation_du_festival">
                  <span class="uk-label uk-label-warning">
                    <span uk-icon="history" class="uk-margin-small-right"></span>
                    {{ festival.decennie_de_creation_du_festival }}
                  </span>
                </div>
              </div>
              
              <!-- Sous-catégories -->
              <div v-if="festival.sous_categorie_musique || festival.sous_categorie_spectacle_vivant || festival.sous_categorie_cinema_et_audiovisuel" class="uk-margin-small">
                <div class="uk-flex uk-flex-middle">
                  <span uk-icon="tag" class="uk-margin-small-right uk-text-muted"></span>
                  <span class="uk-text-small uk-text-muted">
                    {{ festival.sous_categorie_musique || festival.sous_categorie_spectacle_vivant || festival.sous_categorie_cinema_et_audiovisuel }}
                  </span>
                </div>
              </div>
            </div>
            
            <!-- Footer -->
            <div class="uk-card-footer" v-if="festival.site_internet_du_festival || festival.adresse_e_mail">
              <div class="uk-grid-small" uk-grid>
                <div class="uk-width-auto" v-if="festival.site_internet_du_festival">
                  <a 
                    :href="getValidUrl(festival.site_internet_du_festival)" 
                    target="_blank" 
                    class="uk-button uk-button-primary uk-button-small"
                  >
                    <span uk-icon="world" class="uk-margin-small-right"></span>
                    Site web
                  </a>
                </div>
                <div class="uk-width-auto" v-if="festival.adresse_e_mail">
                  <a 
                    :href="`mailto:${festival.adresse_e_mail}`" 
                    class="uk-button uk-button-default uk-button-small"
                  >
                    <span uk-icon="mail" class="uk-margin-small-right"></span>
                    Contact
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Pagination -->
      <div v-if="totalPages > 1" class="uk-margin-large-top">
        <ul class="uk-pagination uk-flex-center" uk-margin>
          <li v-if="currentPage > 1">
            <a @click.prevent="goToPage(1)" href="#"><span uk-pagination-previous></span><span uk-pagination-previous></span></a>
          </li>
          <li v-if="currentPage > 1">
            <a @click.prevent="goToPage(currentPage - 1)" href="#"><span uk-pagination-previous></span></a>
          </li>
          
          <!-- Pages visibles -->
          <li v-for="page in visiblePages" :key="page" :class="{ 'uk-active': page === currentPage }">
            <a v-if="page !== '...'" @click.prevent="goToPage(page)" href="#">{{ page }}</a>
            <span v-else>...</span>
          </li>
          
          <li v-if="currentPage < totalPages">
            <a @click.prevent="goToPage(currentPage + 1)" href="#"><span uk-pagination-next></span></a>
          </li>
          <li v-if="currentPage < totalPages">
            <a @click.prevent="goToPage(totalPages)" href="#"><span uk-pagination-next></span><span uk-pagination-next></span></a>
          </li>
        </ul>
        
        <!-- Navigation rapide -->
        <div class="uk-flex uk-flex-center uk-margin">
          <div class="uk-grid-small uk-flex-middle" uk-grid>
            <div class="uk-width-auto">
              <span class="uk-text-small">Aller à la page :</span>
            </div>
            <div class="uk-width-auto">
              <input 
                v-model.number="jumpToPageInput" 
                @keyup.enter="jumpToPage"
                type="number" 
                :min="1" 
                :max="totalPages"
                class="uk-input uk-form-small uk-form-width-small uk-text-center"
                placeholder="1"
              >
            </div>
            <div class="uk-width-auto">
              <button @click="jumpToPage" class="uk-button uk-button-default uk-button-small">Aller</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Message si pas de festivals après filtrage -->
    <div v-else-if="festivals.length > 0 && filteredFestivals.length === 0" class="uk-margin-top">
      <div class="uk-alert-warning" uk-alert>
        <p>Aucun festival trouvé avec les filtres actuels.</p>
      </div>
    </div>

    <!-- Message si pas de festivals -->
    <div v-else-if="!loading && festivals.length === 0 && !error" class="uk-margin-top">
      <div class="uk-alert-primary" uk-alert>
        <p>Les festivals se chargent automatiquement...</p>
      </div>
    </div>
    
    </div> <!-- Fermeture uk-container -->
  </div> <!-- Fermeture festivals-page -->
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import logger from '../utils/logger.js';

export default {
  name: 'FestivalsPage',
  setup() {
    const festivals = ref([]);
    const allFestivals = ref([]); // Stocke tous les festivals pour la pagination
    const filteredFestivals = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const totalCount = ref(0);
    
    // Variables de pagination
    const currentPage = ref(1);
    const itemsPerPage = ref(20);
    const jumpToPageInput = ref(1);
    
    // Variables pour les logs
    const showLogs = ref(false);
    const logs = ref([]);
    
    // Filtres
    const filterRegion = ref('');
    const filterDiscipline = ref('');
    const searchTerm = ref('');

    const fetchFestivals = async (page = 1, searchQuery = '') => {
      // Correction: s'assurer que page est bien un nombre
      const pageNumber = typeof page === 'number' ? page : 1;
      const query = searchQuery || searchTerm.value;
      
      logger.info('🎪 Starting fetchFestivals', { 
        originalPage: page,
        pageNumber,
        pageType: typeof page,
        searchQuery: query,
        itemsPerPage: itemsPerPage.value 
      });
      
      loading.value = true;
      error.value = null;
      currentPage.value = pageNumber;
      
      const startTime = performance.now();
      
      try {
        const offset = (pageNumber - 1) * itemsPerPage.value;
        
        // Construction de l'URL avec paramètres de recherche
        let apiUrl = `https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets/festivals-global-festivals-_-pl/records?limit=${itemsPerPage.value}&offset=${offset}`;
        
        // Ajout de la recherche si présente
        if (query && query.trim()) {
          // Utilisation de la syntaxe de recherche de l'API data.gouv.fr
          // La recherche se fait sur le champ nom_du_festival avec un LIKE
          const searchParam = `nom_du_festival like "%${encodeURIComponent(query.trim())}%"`;
          apiUrl += `&where=${encodeURIComponent(searchParam)}`;
          
          logger.info('� Adding search parameter', {
            originalQuery: query,
            searchParam,
            encodedParam: encodeURIComponent(searchParam)
          });
        }
        
        logger.info('�🔗 Building API URL', { 
          baseUrl: 'https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets/festivals-global-festivals-_-pl/records',
          params: { 
            limit: itemsPerPage.value, 
            offset,
            pageNumber,
            searchQuery: query,
            calculation: `(${pageNumber} - 1) * ${itemsPerPage.value} = ${offset}`
          },
          fullUrl: apiUrl
        });
        
        logger.logHttpRequest('GET', apiUrl);
        
        const res = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Electron-Demo-App/1.0'
          }
        });
        
        const endTime = performance.now();
        const duration = Math.round(endTime - startTime);
        
        logger.logHttpResponse('GET', apiUrl, res, duration);
        
        if (!res.ok) {
          // Log des détails de l'erreur HTTP
          let errorDetails = {
            status: res.status,
            statusText: res.statusText,
            url: apiUrl,
            headers: {}
          };
          
          // Récupérer les headers de réponse
          res.headers.forEach((value, key) => {
            errorDetails.headers[key] = value;
          });
          
          // Tenter de lire le body de l'erreur
          try {
            const errorText = await res.text();
            errorDetails.responseBody = errorText;
            logger.error('📄 Error response body', { body: errorText });
          } catch (bodyError) {
            logger.warn('⚠️ Could not read error response body', { error: bodyError.message });
          }
          
          logger.error('🚨 HTTP Error Details', errorDetails);
          
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        
        logger.info('📥 Parsing JSON response...');
        const data = await res.json();
        
        logger.info('✅ Festivals data received', { 
          resultsCount: data.results?.length || 0,
          totalCount: data.total_count || 0,
          hasResults: !!data.results,
          dataKeys: Object.keys(data)
        });
        
        // Validation des données
        if (!data.results || !Array.isArray(data.results)) {
          logger.warn('⚠️ Invalid data structure received', { data });
          throw new Error('Invalid API response: missing or invalid results array');
        }
        
        festivals.value = data.results;
        filteredFestivals.value = data.results;
        totalCount.value = data.total_count || 0;
        
        logger.info('🎯 State updated successfully', {
          festivalsCount: festivals.value.length,
          filteredCount: filteredFestivals.value.length,
          totalCount: totalCount.value
        });
        
        // Si c'est la première page, on charge aussi quelques données supplémentaires pour les filtres
        if (page === 1 && allFestivals.value.length === 0) {
          logger.info('📋 Loading additional data for filters...');
          loadAllFestivalsForFilters();
        }
        
      } catch (err) {
        const endTime = performance.now();
        const duration = Math.round(endTime - startTime);
        
        logger.logApiError('festivals API', err, {
          page,
          itemsPerPage: itemsPerPage.value,
          duration,
          currentPage: currentPage.value
        });
        
        error.value = `Erreur lors du chargement des festivals: ${err.message}`;
        
        // Diagnostic supplémentaire pour erreur 400
        if (err.message.includes('400')) {
          logger.error('🔍 Diagnostic erreur 400', {
            possibleCauses: [
              'Paramètres de requête invalides',
              'Limite ou offset invalide', 
              'Format d\'URL incorrect',
              'Headers manquants ou incorrects'
            ],
            currentParams: {
              limit: itemsPerPage.value,
              offset: (page - 1) * itemsPerPage.value,
              page
            }
          });
        }
        
      } finally {
        loading.value = false;
        logger.info('🏁 fetchFestivals completed', { 
          success: !error.value,
          loading: loading.value,
          error: error.value
        });
        
        // Mettre à jour l'affichage des logs
        updateLogsFromLogger();
      }
    };

    // Charge plus de données pour alimenter les filtres (pas d'affichage)
    const loadAllFestivalsForFilters = async () => {
      logger.info('🔍 Loading additional festivals for filters...');
      
      try {
        const filterApiUrl = `https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets/festivals-global-festivals-_-pl/records?limit=200&offset=0`;
        logger.logHttpRequest('GET', filterApiUrl);
        
        const res = await fetch(filterApiUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Electron-Demo-App/1.0'
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          allFestivals.value = data.results || [];
          
          logger.info('✅ Filter data loaded successfully', {
            count: allFestivals.value.length,
            totalAvailable: data.total_count
          });
        } else {
          logger.warn('⚠️ Could not load filter data', {
            status: res.status,
            statusText: res.statusText
          });
        }
      } catch (err) {
        logger.warn('⚠️ Failed to load additional data for filters', { error: err.message });
      }
    };

    // Calculs des options de filtre uniques
    const uniqueRegions = computed(() => {
      const regions = allFestivals.value
        .map(f => f.region_principale_de_deroulement)
        .filter(r => r && r.trim() !== '')
        .filter((value, index, self) => self.indexOf(value) === index)
        .sort();
      return regions;
    });

    const uniqueDisciplines = computed(() => {
      const disciplines = allFestivals.value
        .map(f => f.discipline_dominante)
        .filter(d => d && d.trim() !== '')
        .filter((value, index, self) => self.indexOf(value) === index)
        .sort();
      return disciplines;
    });

    // Calculs de pagination
    const totalPages = computed(() => {
      return Math.ceil(totalCount.value / itemsPerPage.value);
    });

    const startIndex = computed(() => {
      return (currentPage.value - 1) * itemsPerPage.value + 1;
    });

    const endIndex = computed(() => {
      const end = currentPage.value * itemsPerPage.value;
      return Math.min(end, totalCount.value);
    });

    const visiblePages = computed(() => {
      const total = totalPages.value;
      const current = currentPage.value;
      const pages = [];
      
      if (total <= 7) {
        for (let i = 1; i <= total; i++) {
          pages.push(i);
        }
      } else {
        if (current <= 4) {
          for (let i = 1; i <= 5; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(total);
        } else if (current >= total - 3) {
          pages.push(1);
          pages.push('...');
          for (let i = total - 4; i <= total; i++) {
            pages.push(i);
          }
        } else {
          pages.push(1);
          pages.push('...');
          for (let i = current - 1; i <= current + 1; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(total);
        }
      }
      
      return pages;
    });

    // Fonction de recherche avec l'API
    const searchFestivals = () => {
      logger.info('🔍 Starting search', { 
        searchTerm: searchTerm.value,
        trimmed: searchTerm.value.trim()
      });
      
      if (searchTerm.value.trim()) {
        currentPage.value = 1; // Remettre à la première page pour la recherche
        fetchFestivals(1, searchTerm.value.trim());
      } else {
        // Si pas de terme de recherche, charger tous les festivals
        clearSearch();
      }
    };

    const clearSearch = () => {
      logger.info('🧹 Clearing search');
      searchTerm.value = '';
      currentPage.value = 1;
      fetchFestivals(1, ''); // Recherche vide = tous les festivals
    };

    // Fonction appelée lors de la saisie pour éviter trop d'appels API
    let searchTimeout = null;
    const onSearchInput = () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        if (searchTerm.value.trim().length >= 3) {
          logger.debug('🔤 Auto-search triggered', { term: searchTerm.value });
          searchFestivals();
        } else if (searchTerm.value.trim().length === 0) {
          clearSearch();
        }
      }, 800); // Attendre 800ms après la dernière frappe
    };

    // Fonction de filtrage (maintenant pour les filtres locaux seulement)
    const filterFestivals = () => {
      logger.debug('🔍 Filtering festivals (local filters only)', {
        totalFestivals: festivals.value.length,
        filters: {
          region: filterRegion.value,
          discipline: filterDiscipline.value
        }
      });
      
      let filtered = festivals.value;

      // Filtre par région
      if (filterRegion.value) {
        const beforeCount = filtered.length;
        filtered = filtered.filter(f => 
          f.region_principale_de_deroulement === filterRegion.value
        );
        logger.debug(`📍 Region filter applied: ${beforeCount} -> ${filtered.length}`);
      }

      // Filtre par discipline
      if (filterDiscipline.value) {
        const beforeCount = filtered.length;
        filtered = filtered.filter(f => 
          f.discipline_dominante === filterDiscipline.value
        );
        logger.debug(`🎭 Discipline filter applied: ${beforeCount} -> ${filtered.length}`);
      }

      // Note: La recherche textuelle se fait maintenant côté API, pas ici

      filteredFestivals.value = filtered;
      
      logger.info('✅ Local filtering completed', {
        originalCount: festivals.value.length,
        filteredCount: filtered.length,
        filtersApplied: {
          region: !!filterRegion.value,
          discipline: !!filterDiscipline.value,
          search: 'handled by API'
        }
      });
    };

    // Fonctions de navigation de pagination
    const goToPage = (page) => {
      // Conversion sécurisée en nombre
      const pageNumber = typeof page === 'number' ? page : parseInt(page, 10);
      
      logger.info('📄 Navigation to page requested', { 
        originalPage: page,
        pageNumber,
        pageType: typeof page,
        currentPage: currentPage.value,
        totalPages: totalPages.value
      });
      
      if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages.value && pageNumber !== currentPage.value) {
        logger.info('✅ Page navigation approved, fetching data...');
        fetchFestivals(pageNumber, searchTerm.value); // Passer la recherche actuelle
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        logger.warn('❌ Page navigation rejected', {
          reason: isNaN(pageNumber) ? 'Not a number' :
                  pageNumber < 1 ? 'Page < 1' : 
                  pageNumber > totalPages.value ? 'Page > totalPages' : 
                  pageNumber === currentPage.value ? 'Same page' : 'Unknown',
          originalPage: page,
          pageNumber,
          currentPage: currentPage.value,
          totalPages: totalPages.value
        });
      }
    };

    const jumpToPage = () => {
      const inputValue = jumpToPageInput.value;
      const pageNumber = parseInt(inputValue, 10);
      
      logger.info('🎯 Jump to page requested', { 
        inputValue,
        pageNumber,
        isValidNumber: !isNaN(pageNumber)
      });
      
      if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages.value) {
        logger.info('✅ Jump approved');
        goToPage(pageNumber);
      } else {
        logger.warn('❌ Jump rejected, resetting input', {
          inputValue,
          pageNumber,
          validRange: `1-${totalPages.value}`,
          isNaN: isNaN(pageNumber)
        });
        jumpToPageInput.value = currentPage.value;
      }
    };

    const changeItemsPerPage = () => {
      logger.info('📏 Items per page changed', { 
        newItemsPerPage: itemsPerPage.value,
        resettingToPage: 1
      });
      
      currentPage.value = 1;
      fetchFestivals(1, searchTerm.value); // Passer la recherche actuelle
    };

    // Fonction de test de l'API
    const testApiConnection = async () => {
      logger.info('🧪 Starting API connection test...');
      
      const testUrls = [
        'https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets/',
        'https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets/festivals-global-festivals-_-pl',
        'https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets/festivals-global-festivals-_-pl/records?limit=1',
        'https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets/festivals-global-festivals-_-pl/records?limit=5&offset=0'
      ];
      
      for (const [index, url] of testUrls.entries()) {
        try {
          logger.info(`🔗 Test ${index + 1}/${testUrls.length}: ${url}`);
          
          const startTime = performance.now();
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'Electron-Demo-App/1.0'
            }
          });
          const endTime = performance.now();
          
          logger.info(`📊 Response ${index + 1}: ${response.status} ${response.statusText} (${Math.round(endTime - startTime)}ms)`);
          
          if (response.ok) {
            try {
              const data = await response.json();
              logger.info(`✅ Test ${index + 1} SUCCESS`, {
                status: response.status,
                dataKeys: Object.keys(data),
                resultsCount: data.results?.length,
                totalCount: data.total_count
              });
            } catch (parseError) {
              logger.warn(`⚠️ Test ${index + 1} - JSON parse error`, { error: parseError.message });
            }
          } else {
            logger.error(`❌ Test ${index + 1} FAILED`, {
              status: response.status,
              statusText: response.statusText,
              url
            });
          }
        } catch (error) {
          logger.error(`💥 Test ${index + 1} EXCEPTION`, {
            error: error.message,
            url
          });
        }
        
        // Petite pause entre les tests
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      logger.info('🏁 API connection test completed');
      updateLogsFromLogger();
    };

    // Synchroniser les logs du logger
    const updateLogsFromLogger = () => {
      logs.value = [...logger.getLogs()];
    };

    const clearLogs = () => {
      logger.clearLogs();
      logs.value = [];
    };

    const formatLogTime = (timestamp) => {
      return new Date(timestamp).toLocaleTimeString();
    };

    // Fonction pour valider les URLs
    const getValidUrl = (url) => {
      if (!url) return '#';
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
      }
      return `http://${url}`;
    };

    // Hook pour mettre à jour les logs régulièrement
    const logUpdateInterval = setInterval(() => {
      if (showLogs.value) {
        updateLogsFromLogger();
      }
    }, 1000);
    
    // Nettoyage à la destruction du composant
    const cleanup = () => {
      clearInterval(logUpdateInterval);
    };

    // Chargement automatique des festivals au montage du composant
    onMounted(() => {
      logger.info('🚀 FestivalsPage mounted, auto-loading festivals...');
      fetchFestivals(1);
    });
    
    // Retour avec cleanup
    return {
      festivals,
      filteredFestivals,
      loading,
      error,
      totalCount,
      currentPage,
      itemsPerPage,
      totalPages,
      startIndex,
      endIndex,
      visiblePages,
      jumpToPageInput,
      showLogs,
      logs,
      filterRegion,
      filterDiscipline,
      searchTerm,
      uniqueRegions,
      uniqueDisciplines,
      fetchFestivals,
      searchFestivals,
      clearSearch,
      onSearchInput,
      testApiConnection,
      filterFestivals,
      goToPage,
      jumpToPage,
      changeItemsPerPage,
      updateLogsFromLogger,
      clearLogs,
      formatLogTime,
      getValidUrl
    };
  }
}
</script>

<style scoped>
/* Minimal custom styles - using UIkit utilities for design */
.logs-container {
  max-height: 400px;
  overflow-y: auto;
  font-family: monospace;
}

.log-entry {
  padding: 8px;
  margin-bottom: 4px;
  border-left: 3px solid transparent;
}

.log-debug { border-left-color: #999; }
.log-info { border-left-color: #1e87f0; }
.log-warn { border-left-color: #faa05a; }
.log-error { border-left-color: #f0506e; }

.log-time { color: #999; }
.log-level { font-weight: bold; }
.log-data { 
  background: #f8f9fa; 
  padding: 8px; 
  margin: 4px 0; 
  border-radius: 4px; 
  font-size: 11px;
  max-height: 120px;
  overflow-y: auto;
}
</style>