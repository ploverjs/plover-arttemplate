'use strict';


const SafeString = require('plover-util/lib/safe-string');


const fs = require('fs');
const pathUtil = require('path');
const engine = require('..');



/* global __dirname */


describe('index', function() {
  it('编译模板并使用', function() {
    const tpl = '{{name}}';
    const fn = engine.compile(tpl, {});
    fn({ name: 'plover' }).should.equal('plover');
  });


  it('debug方式并编译出模板方便调试', function() {
    const path = pathUtil.join(__dirname, 'fixtures/t1.art');
    const outpath = '.' + path + '.js';
    const tpl = fs.readFileSync(path, 'utf-8');
    if (fs.existsSync(path)) {
      fs.unlink(outpath);
    }

    engine.compile(tpl, { development: true, path: path });
    fs.existsSync(path).should.be.true;
    fs.unlink(outpath);
  });


  it('使用art模板语言的各种功能', function() {
    const path = pathUtil.join(__dirname, 'fixtures/t2.art');
    const tpl = fs.readFileSync(path, 'utf-8');
    const fn = engine.compile(tpl, {});
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

    fn(context).should.be.type('string');
  });


  it('编译失败出异常', function() {
    const tpl = '{{each list as item}}';
    (function() {
      engine.compile(tpl, {});
    }).should.throw();
  });
});
