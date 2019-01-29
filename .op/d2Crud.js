const ejs = require('ejs')
const fs = require('fs')
const path = require('path')

export default (sourceDir, dataConfig, fields, searchList) => {
  const { name, title, url } = dataConfig
  const options = { debug: true, compileDebug: true }

  const templateData = [
    { type: 'list', path: `/${name}`, title: `${title} 列表`, icon: 'th-list' },
    { type: 'edit', path: `/${name}/:id/edit`, title: `${title} 编辑` },
    { type: 'add', path: `/${name}-add`, title: `${title} 新增`, icon: 'plus' }
  ]

  const menu = {
    'title': title,
    'icon': 'folder',
    'children': []
  }

  const pushEnableType = (template) => {
    menu.children.push({
      'path': template.path,
      'title': template.title,
      'icon': template.icon
    })
  }

  const data = {fields, templateData, apiPath: url, searchList}

  const renderTemplate = template => {
    ejs.renderFile(path.join(sourceDir, `.op/templates/${template.type}.vue.ejs`), data, options, function (err, str) {
      if (err) {
        console.log(`renderTemplate error. type: ${template.type}, err: ${err}`)
      }
      const dirName = path.join(sourceDir, `/src/pages/${name}/`)
      if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName)
      }
      fs.writeFileSync(path.join(dirName, `${template.type}.vue`), str)
    })
  }

  const routes = []

  const addRouters = template => {
    routes.push({ name: `${name}-${template.type}`, template })
  }

  let routesLines = []

  const addRouterLines = template => {
    routesLines.push(`      {
        path: '${template.path}',
        name: '${name}-${template.type}',
        component: () => import('@/pages/${name}/${template.type}'),
        meta: { meta, title: '${template.title}' }
      },`)
  }

  if (dataConfig.listEnable) {
    const template = templateData.find(template => template.type === 'list')
    renderTemplate(template)
    pushEnableType(template)
    addRouters(template)
  }

  if (dataConfig.editEnable) {
    const template = templateData.find(template => template.type === 'edit')
    renderTemplate(template)
    addRouters(template)
  }

  if (dataConfig.addEnable) {
    const template = templateData.find(template => template.type === 'add')
    renderTemplate(template)
    pushEnableType(template)
    addRouters(template)
  }

  const menuPath = `${sourceDir}/src/menu/aside.json`
  fs.readFile(menuPath, {}, (err, data) => {
    if (err) {}
    const menus = JSON.parse(data)
    if (menus.some(menu => menu.title === title)) {
      return
    }
    menus.push(menu)
    fs.writeFile(menuPath, JSON.stringify(menus, null, 2), (err) => {
      console.log(`write ${routesPath}. error: ${err}`)
    })
  })

  const routesPath = `${sourceDir}/src/router/frameIn.js`
  fs.readFile(routesPath, { encoding: 'utf8' }, (err, data) => {
    if (err) {}

    const lines = data.split('\n')
    let count = 0
    let codeIndex = 0

    console.log('routes', routes)

    // 删除无需重复生成的route
    lines.forEach(line => {
      if (line) {
        const trimedLine = line.replace(/\s/g, '')
        if (trimedLine.startsWith('name:\'')) {
          // 取得route name
          const routeName = trimedLine.substring('name:\''.length, trimedLine.lastIndexOf('\''))
          // 查找待生成的route列表中是否存在该route，存在则删除列表中的对应route
          const index = routes.map(route => route.name).indexOf(routeName)
          if (index !== -1) {
            routes.splice(index, 1)
          }
        }
      }
    })
    console.log('routes', routes)
    if (routes.length === 0) {
      return
    }

    routes.forEach(route => {
      addRouterLines(route.template)
    })

    // 倒查']'，以便找到写入新代码地点
    for (let i = lines.length; i > 0; i--) {
      const line = lines[i]
      if (line && line.endsWith(']')) {
        count++
      }
      if (count === 2) {
        codeIndex = i - 1 // 分号上一行是代码最后一行
        break
      }
    }

    let line = lines[codeIndex]
    if (!line.endsWith(',')) {
      lines[codeIndex] = line + ','
    }
    const newLines = lines.slice(0, codeIndex + 1).concat(routesLines).concat(lines.slice(codeIndex + 1))
    fs.writeFile(routesPath, newLines.join('\n'), (err) => {
      console.log(`write ${routesPath}. error: ${err}`)
    })
  })
}