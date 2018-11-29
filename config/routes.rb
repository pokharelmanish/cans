Rails.application.routes.draw do
  root 'application#fallback_index_html'
  get 'user/account', to: 'account#index'
  get 'user/logout', to: 'logout#index'

  namespace :api, defaults: { format: 'json' } do
    resources :people, only: [:show, :create, :update] do
      collection do
        post '_search', to: 'people#search'
      end
    end

    resources :people_searches, only: :index

    resources :clients, only: [:show]

    resources :instruments, only: [:show] do
      member do
        get 'i18n/:language/', to: 'instruments#translations_by_instrument_id'
      end
    end

    resources :assessments, only: [:show, :create, :update] do
      collection do
        post '_search', to: 'assessments#search'
        get ':id/changes', to: 'assessments#changes'
      end
    end

    resources :counties, only: [:index] do
    end

    resources :sensitivity_types, only: [:index] do
    end

    resources :staff, only: [:show] do
      collection do
        get 'subordinates', to: 'staff#subordinates_index'
        get 'assessments', to: 'staff#assessments'
      end
      member do
        get 'people', to: 'staff#social_worker_clients'
      end
    end

    get 'security/check_permission/:permission', to: 'security#check_permission'
    get 'security/refresh', to: 'security#refresh'
  end

  get '*path', to: "application#fallback_index_html", constraints: -> (request) do
    !request.xhr? && request.format.html?
   end
end
