from setuptools import setup
from setuptools.command.install import install
from subprocess import check_call
from os.path import join, dirname, abspath

here = dirname(abspath(__file__))

NPM_CMD = ['npm', 'install', here]
BOWER_CMD = [join(here, 'node_modules', '.bin', 'bower'), 'install', '-y']
GULP = [join(here, 'node_modules', '.bin', 'gulp')]


class OPAuctionInstall(install):
    def run(self):
        install.run(self)
        check_call(NPM_CMD)
        check_call(BOWER_CMD)
        check_call(GULP)


setup(name='openprocurement.auction.js',
      version='0.0.1',
      description='frontend application for openprocurement.auction',
      classifiers=[
          "Framework :: Pylons",
          "License :: OSI Approved :: Apache Software License",
          "Programming Language :: Python",
          "Topic :: Internet :: WWW/HTTP",
          "Topic :: Internet :: WWW/HTTP :: WSGI :: Application"
      ],
      keywords="web services",
      author='Quintagroup, Ltd.',
      author_email='info@quintagroup.com',
      license='Apache License 2.0',
      url='https://github.com/yshalenyk/openprocurement.auction.js',
      include_package_data=True,
      zip_safe=False,
      cmdclass={
        'install': OPAuctionInstall
      }
)
