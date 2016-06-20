'use strict';


const SafeString = require('plover-util/lib/safe-string');


const fs = require('fs');
const pathUtil = require('path');
const engine = require('..');



/* global __dirname */


describe('index', function() {
  it('编译模板并渲染', function() {
    const tpl = '{{name}}';
    const fn = engine.compile(tpl);
    fn({ name: 'plover' }).should.equal('plover');
  });


  it('使用art模板语言的各种功能', function() {
    const path = pathUtil.join(__dirname, 'fixtures/t2.art');
    const tpl = fs.readFileSync(path, 'utf-8');
    const fn = engine.compile(tpl);
    const context = {
      name: 'Plover',
      version: '1.0.1',
      keywords: ['framework', 'koa', 'es6']
    };

    context.o = new SafeString('<h1>hello world</h1>');
    context.map = {
      name: 'Plover',
      version: '0.1.0'
    };

    context.format = function(v, postfix) {
      return v + postfix;
    };

    const outpath = pathUtil.join(__dirname, 'fixtures/t2.out');
    fn(context).replace(/\s+/g, ' ').should
      .equal(fs.readFileSync(outpath, 'utf-8').replace(/\s+/g, ' '));
  });


  it('编译失败出异常', function() {
    const tpl = '{{each list as item}}';
    (function() {
      engine.compile(tpl, {});
    }).should.throw();
  });
});
