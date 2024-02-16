import Main from '@/components/main/main'
import parentView from '@/components/parent-view'

export default [{
  path: '/login',
  name: 'login',
  meta: {
    title: 'Login',
    hideInMenu: true
  },
  component: () =>
    import('@/view/login/login.vue')
},
{
  path: '/port',
  name: 'port',
  meta: {
    title: 'IP',
    hideInMenu: true
  },
  component: () =>
    import('@/view/ipconfig/port.vue')
},
{
  path: '/data_importer',
  name: 'data_importer',
  meta: {
    icon: '',
    title: 'Data Importer',
    hideInMenu: true
  },
  component: () =>
    import('@/view/system_management/data_importer/list.vue')
},
{
  path: '/',
  component: Main,
  name: '_home',
  redirect: '/home',
  meta: {
    hideInMenu: true,
    notCache: true
  },
  children: [{
    path: '/home',
    name: 'home',
    meta: {
      hideInMenu: true,
      title: 'Home',
      notCache: true,
      icon: 'home'
    },
    component: () =>
      import('@/view/home')
  }]
},

{
  path: '/storage_management',
  name: 'storage_management',
  meta: {
    icon: 'iconcangchuguanli',
    title: 'Warehouse',
    showAlways: true,
    access: ['web_storage_management']
  },
  component: Main,
  children: [
    {
      path: 'good_receive',
      name: 'good_receive',
      meta: {
        icon: '',
        showAlways: true,
        access: ['web_input'],
        title: 'Good Receipt'
      },
      component: parentView,
      children: [
        {
          path: 'good_receive_create/:id?/:type?',
          name: 'good_receive_create',
          meta: {
            icon: '',
            title: 'Receipt Create',
            access: ['web_input_create']
          },
          component: () =>
            import('@/view/storage_management/GoodReceive/Create/list.vue')
        },
        {
          path: 'good_receive_info',
          name: 'good_receive_info',
          meta: {
            icon: '',
            title: 'Receipt Search',
            access: ['web_input_search']
          },
          component: () =>
            import('@/view/storage_management/GoodReceive/Detail/list.vue')
        },
        // {
        //   path: 'good_receive_info_uncompleted',
        //   name: 'good_receive_info_uncompleted',
        //   meta: {
        //     icon: '',
        //     title: 'Receipt Search',
        //     access: ['web_input_search']
        //   },
        //   component: () =>
        //     import('@/view/storage_management/GoodReceive/Detail/uncompleted.vue')
        // },
      ]
    },
    {
      path: 'put_away',
      name: 'put_away',
      meta: {
        icon: '',
        showAlways: true,
        access: ['web_shelf_load'],
        title: 'PutAway'
      },
      component: parentView,
      children: [
        {
          path: 'put_away_create/:id?',
          name: 'put_away_create',
          meta: {
            icon: '',
            title: 'PutAway Create',
            access: ['web_shelf_load_create']
          },
          component: () =>
            import('@/view/storage_management/PutAway/Create/list.vue')
        },
        {
          path: 'put_away_info',
          name: 'put_away_info',
          meta: {
            icon: '',
            title: 'PutAway Search',
            access: ['web_shelf_load_search']
          },
          component: () =>
            import('@/view/storage_management/PutAway/Detail/list.vue')
        },
        // {
        //   path: 'put_away_info_uncompleted',
        //   name: 'put_away_info_uncompleted',
        //   meta: {
        //     icon: '',
        //     title: 'PutAway Search',
        //     access: ['web_shelf_load_search']
        //   },
        //   component: () =>
        //     import('@/view/storage_management/PutAway/Detail/uncompleted.vue')
        // },
      ]
    },
    {
      path: 'pick',
      name: 'pick',
      meta: {
        icon: '',
        showAlways: true,
        title: 'Pick',
        access: ['web_shelf_unload']
      },
      component: parentView,
      children: [
        {
          path: 'pick_create/:id?/:type?',
          name: 'pick_create',
          meta: {
            icon: '',
            access: ['web_shelf_unload_create'],
            title: 'Pick Create'
          },
          component: () =>
            import('@/view/storage_management/Pick/Create/list.vue')
        },
        {
          path: 'pick_info',
          name: 'pick_info',
          meta: {
            icon: '',
            access: ['web_shelf_unload_search'],
            title: 'Pick Search'
          },
          component: () =>
            import('@/view/storage_management/Pick/Detail/list.vue')
        },
        // {
        //   path: 'pick_info_uncompleted',
        //   name: 'pick_info_uncompleted',
        //   meta: {
        //     icon: '',
        //     access: ['web_shelf_unload_search'],
        //     title: 'Pick Search'
        //   },
        //   component: () =>
        //     import('@/view/storage_management/Pick/Detail/uncompleted.vue')
        // },
      ]
    },
    {
      path: 'delivery',
      name: 'delivery',
      meta: {
        icon: '',
        showAlways: true,
        access: ['web_output'],
        title: 'Deliver'
      },
      component: parentView,
      children: [
        {
          path: 'delivery_create/:id?/:type?',
          name: 'delivery_create',
          meta: {
            icon: '',
            title: 'Deliver Create',
            access: ['web_output_create']
          },
          component: () =>
            import('@/view/storage_management/Delivery/Create/list.vue')
        },
        {
          path: 'delivery_info',
          name: 'delivery_info',
          meta: {
            icon: '',
            title: 'Deliver Search',
            access: ['web_output_search']
          },
          component: () =>
            import('@/view/storage_management/Delivery/Detail/list.vue')
        },
        // {
        //   path: 'delivery_info_uncompleted',
        //   name: 'delivery_info_uncompleted',
        //   meta: {
        //     icon: '',
        //     title: 'Deliver Search',
        //     access: ['web_output_search']
        //   },
        //   component: () =>
        //     import('@/view/storage_management/Delivery/Detail/uncompleted.vue')
        // },
      ]
    },
    {
      path: 'warehouse_return',
      name: 'warehouse_return',
      meta: {
        icon: '',
        showAlways: true,
        access: ['web_return'],
        title: 'Return OPs'
      },
      component: parentView,
      children: [
        {
          path: 'return',
          name: 'return',
          meta: {
            icon: '',
            title: 'Return OPs',
            access: ['web_return_create']
          },
          component: () =>
            import('@/view/storage_management/ReturnOPs/list.vue')
        },
        {
          path: 'return_detail/:id?',
          name: 'return_detail',
          meta: {
            icon: '',
            hideInMenu: true,
            title: 'Return Search'
          },
          component: () =>
            import('@/view/storage_management/ReturnOPs/detail.vue')
        },
      ]
    },
    {
      path: 'warehouse_sorting',
      name: 'warehouse_sorting',
      meta: {
        icon: '',
        showAlways: true,
        access: ['web_arrangement'],
        title: 'Sort'
      },
      component: parentView,
      children: [
        {
          path: 'sort',
          name: 'sort',
          meta: {
            icon: '',
            title: 'Sort',
            access: ['web_arrangement_create']
          },
          component: () =>
            import('@/view/storage_management/Sort/list.vue')
        },
        {
          path: 'sort_detail/:id?',
          name: 'sort_detail',
          meta: {
            icon: '',
            hideInMenu: true,
            title: 'Sort Search'
          },
          component: () =>
            import('@/view/storage_management/Sort/detail.vue')
        },
      ]
    },
    {
      path: 'physical_inventory',
      name: 'physical_inventory',
      meta: {
        icon: '',
        showAlways: true,
        title: 'Count',
        access: ['web_inventory_management']
      },
      component: parentView,
      children: [{
        path: 'new_inv_sheet',
        name: 'new_inv_sheet',
        meta: {
          icon: '',
          title: 'Plnv Create',
          access: ['web_inventory_table_creation']
        },
        component: () => import('@/view/storage_management/PhysicalInventory/NewPInvSheet/list.vue')
      },
      {
        path: 'new_inv_sheet_detail/:id?',
        name: 'new_inv_sheet_detail',
        meta: {
          icon: '',
          hideInMenu: true,
          title: 'Plnv Create Info'
        },
        component: () => import('@/view/storage_management/PhysicalInventory/NewPInvSheet/detail.vue')
      },
      {
        path: 'inv_count',
        name: 'inv_count',
        meta: {
          icon: '',
          title: 'Plnv Count',
          access: ['web_counting_count']
        },
        component: () => import('@/view/storage_management/PhysicalInventory/PInvCount/list.vue')
      },
      {
        path: 'inv_count_detail/:id?',
        name: 'inv_count_detail',
        meta: {
          icon: '',
          hideInMenu: true,
          title: 'Plnv Count Info'
        },
        component: () => import('@/view/storage_management/PhysicalInventory/PInvCount/detail.vue')
      },
      {
        path: 'inv_diff_inquiry',
        name: 'inv_diff_inquiry',
        meta: {
          icon: '',
          title: 'Plnv Diff Inquiry',
          access: ['web_inventory_difference_view']
        },
        component: () => import('@/view/storage_management/PhysicalInventory/PInvDiffInquiry/list.vue')
      },
      {
        path: 'inv_diff_inquiry_detail/:id?',
        name: 'inv_diff_inquiry_detail',
        meta: {
          icon: '',
          hideInMenu: true,
          title: 'Plnv Diff Inquiry Info'
        },
        component: () => import('@/view/storage_management/PhysicalInventory/PInvDiffInquiry/detail.vue')
      }
      ]
    }
  ]
},
{
  path: '/reporting',
  name: 'reporting',
  meta: {
    icon: 'iconbaobiaochaxun',
    title: 'Inventory Report',
    showAlways: true,
    access: ['web_report_query']
  },
  component: Main,
  children: [
    {
      path: 'physical',
      name: 'physical',
      meta: {
        icon: '',
        title: 'Physical Inventory',
        access: ['physical_inventory_report']
      },
      component: () => import('@/view/Reporting/PhysicalInventory/list.vue')
    },
    {
      path: 'location',
      name: 'location',
      meta: {
        icon: '',
        title: 'Bin',
        access: ['location_report']
      },
      component: () => import('@/view/Reporting/Location/list.vue')
    },
    {
      path: 'count',
      name: 'count',
      meta: {
        icon: '',
        title: 'Count',
        access: ['count_report']
      },
      component: () => import('@/view/Reporting/Count/list.vue')
    },
    {
      path: 'count_diff',
      name: 'count_diff',
      meta: {
        icon: '',
        title: 'CountDiff',
        access: ['count_report']
      },
      component: () => import('@/view/Reporting/Count/listDiff.vue')
    },
    {
      path: 'physical_moving',
      name: 'physical_moving',
      meta: {
        icon: '',
        title: 'physical Moving',
        access: ['user_physical_moving_report']
      },
      component: () => import('@/view/Reporting/PhysicalMoving/list.vue')
    },
    {
      path: 'aging',
      name: 'aging',
      meta: {
        icon: '',
        title: 'Aging',
        access: ['aging_report']
      },
      component: () => import('@/view/Reporting/Aging/list.vue')
    },
    {
      path: 'incoming',
      name: 'incoming',
      meta: {
        icon: '',
        title: 'Incoming',
        access: ['incoming_report']
      },
      component: () => import('@/view/Reporting/Incoming/list.vue')
    },
    {
      path: 'invoiced',
      name: 'invoiced',
      meta: {
        icon: '',
        title: 'Invoiced',
        access: ['invoiced_report']
      },
      component: () => import('@/view/Reporting/Invoiced/list.vue')
    },
    {
      path: 'transfer_crop',
      name: 'transfer_crop',
      meta: {
        icon: '',
        title: 'transferCrop',
        access: ['difference_report']
      },
      component: () => import('@/view/Reporting/TransferCrop/list.vue')
    }
  ]
},

{
  path: '/system_management',
  name: 'system_management',
  meta: {
    showAlways: true,
    icon: 'iconxitongguanli',
    title: 'System',
    access: ['web_system_management']
  },
  component: Main,
  children: [{
    path: 'users_and_roles',
    name: 'users_and_roles',
    meta: {
      icon: '',
      showAlways: true,
      title: 'User And Role',
      access: ['web_users_and_roles']
    },
    component: parentView,
    children: [{
      path: 'user_management',
      name: 'user_management',
      meta: {
        icon: '',
        title: 'User',
        access: ['web_user_management']
      },
      component: () =>
        import('@/view/system_management/users_and_roles/user_management/list.vue')
    },
    {
      path: 'purchasing_system',
      name: 'purchasing_system',
      meta: {
        icon: '',
        title: 'Role',
        access: ['web_purchasing_system']
      },
      component: () =>
        import('@/view/system_management/users_and_roles/role_management/list.vue')
    }
    ]
  },
  {
    path: 'organizational_structure',
    name: 'organizational_structure',
    meta: {
      icon: '',
      showAlways: true,
      title: 'Org Structure',
      access: ['web_organizational_structure']
    },
    component: parentView,
    children: [{
      path: 'company',
      name: 'company',
      meta: {
        icon: '',
        title: 'Company',
        access: ['web_company']
      },
      component: () =>
        import('@/view/system_management/organizational_structure/company/list.vue')
    },
    {
      path: 'warehouse_number',
      name: 'warehouse_number',
      meta: {
        icon: '',
        title: 'Warehouse',
        access: ['web_warehouse_number']
      },
      component: () =>
        import('@/view/system_management/organizational_structure/warehouse_number/list.vue')
    },
    {
      path: 'storage_type',
      name: 'storage_type',
      meta: {
        icon: '',
        title: 'Zoon',
        access: ['web_storage_type']
      },
      component: () =>
        import('@/view/system_management/organizational_structure/storage_type/list.vue')
    },
    {
      path: 'position',
      name: 'position',
      meta: {
        icon: '',
        title: 'Location',
        access: ['web_position']
      },
      component: () =>
        import('@/view/system_management/organizational_structure/position/list.vue')
    },
    ]
  },
  {
    path: 'master_data',
    name: 'master_data',
    meta: {
      icon: '',
      showAlways: true,
      title: 'Master Data',
      access: ['web_master_data']
    },
    component: parentView,
    children: [

      {
        path: 'materiel',
        name: 'materiel',
        meta: {
          icon: '',
          title: 'Item Master',
          access: ['web_materiel']
        },
        component: () =>
          import('@/view/system_management/master_data/materiel/list.vue')
      },

      {
        path: 'measurement_unit',
        name: 'measurement_unit',
        meta: {
          icon: '',
          title: 'UoM',
          access: ['web_measurement_unit']
        },
        component: () =>
          import('@/view/system_management/master_data/measurement_unit/list.vue')
      }
    ]
  },
  {
    path: 'system_log',
    name: 'system_log',
    meta: {
      icon: '',
      // showAlways: true,
      hideInMenu: true,
      title: 'System Log',
      access: ['web_system_log']
    },
    component: parentView,
    children: [{
      path: 'logon_log',
      name: 'logon_log',
      meta: {
        icon: '',
        title: 'Login Log Inquiry',
        access: ['web_logon_log']
      },
      component: () =>
        import('@/view/system_management/system_log/logon_log/list.vue')
    },
    {
      //path: 'exceiption_log',
      path: '/system_log',
      name: 'exceiption_log',
      meta: {
        icon: '',
        title: 'Exception Log Inqry',
        access: ['web_exceiption_log']
      },
      component: () =>
        import('@/view/system_management/system_log/exceiption_log/list.vue')
    }
    ]
  },
  {
    path: 'inventory_labels_print',
    name: 'inventory_labels_print',
    meta: {
      icon: '',
      title: 'Inventory Labels Print',
      access: ['web_print_label']
    },
    component: () =>
      import('@/view/system_management/inventory_labels_print/list.vue')
  },
  {
    path: 'upgrade_app',
    //path: '/app',
    name: 'upgrade_app',
    meta: {
      icon: '',
      title: 'PDA Manager',
      hideInMenu: false,
      access: ['web_upgrade_app']
    },
    component: () =>
      import('@/view/system_management/upgrade_app/list.vue')
  },
  {
    path: 'passwordUpdate',
    name: 'passwordUpdate',
    meta: {
      hideInMenu: true,
      hideInBread: true,
      icon: '',
      title: '用户信息修改'
    },
    component: () => import('@/view/system_management/user_manage/passwordUpdate.vue')
  }
]
},
{
  path: '/message_center',
  name: 'message_center',
  meta: {
    showAlways: true,
    icon: 'iconcangchuguanli-yanshouguanli-yanshoutongzhi',
    title: 'Message Center',
    access: ['web_message_center']
  },
  component: Main,
  children: [{
    path: 'system_bulletin',
    name: 'system_bulletin',
    meta: {
      icon: '',
      title: 'System Posts',
      access: ['web_system_bulletin']
    },
    component: () =>
      import('@/view/message_center/system_bulletin/list.vue')
  }]
},
{
  path: '/401',
  name: 'error_401',
  meta: {
    hideInMenu: true
  },
  component: () =>
    import('@/view/system_page/401.vue')
},
{
  path: '/500',
  name: 'error_500',
  meta: {
    hideInMenu: true
  },
  component: () =>
    import('@/view/system_page/500.vue')
},
{
  path: '*',
  name: 'error_404',
  meta: {
    hideInMenu: true
  },
  component: () =>
    import('@/view/system_page/404.vue')
}
]
