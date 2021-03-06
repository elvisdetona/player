// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var UIPlugin = require('../../base/ui_plugin')
var Styler = require('../../base/styler')
var JST = require('../../base/jst')

class WaterMarkPlugin extends UIPlugin {
  get name() { return 'watermark' }
  get type() { return 'ui' }

  initialize(options) {
    super(options)
    this.template = JST[this.name]
    this.position = options.position || "bottom-right"
    this.imageUrl = options.imageUrl || 'assets/watermark.png'
    this.render()
  }

  bindEvents() {
    this.listenTo(this.container, 'container:play', this.onPlay)
    this.listenTo(this.container, 'container:stop', this.onStop)
    this.listenTo(this.container, 'container:pip', this.onPip)
  }

  onPlay() {
    if (!this.hidden)
      this.$el.show()
  }

  onStop() {
    this.$el.hide()
  }

  onPip(isPip) {
    this.hidden = !!isPip
    if (isPip) {
      this.$el.hide()
    } else {
      this.$el.show()
    }
  }

  render() {
    this.$el.hide()
    var templateOptions = {position: this.position, imageUrl: this.imageUrl}
    this.$el.html(this.template(templateOptions))
    var style = Styler.getStyleFor(this.name)
    this.container.$el.append(style)
    this.container.$el.append(this.$el)
    return this
  }
}

module.exports = WaterMarkPlugin
