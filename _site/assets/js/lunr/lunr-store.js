var store = [{
        "title": "[Django] DateTimeField",
        "excerpt":"2021-08-23 15:00:00.000000 DateTimeField를 사용했을 때 위의 형식처럼 데이터가 들어가게 된다. 원하는 데이터만 뽑아오고 싶다! &gt;&gt;&gt; project.end_date datetime.datetime(2021, 11, 6, 0, 0, tzinfo=&lt;UTC&gt;) DateTimeField를 가지고 있는 객체의 필드를 가져오면 이런 형식으로 출력된다 날짜만 출력 &gt;&gt;&gt; project.end_date.date() datetime.date(2021, 11, 6) date()를 이용하여 날짜만 뽑아올 수 있다. 시간만 출력 &gt;&gt;&gt; project.end_date.time() datetime.time(0, 0)...","categories": ["TIL"],
        "tags": ["Python","Django"],
        "url": "/til/datetime/",
        "teaser": null
      },{
        "title": "개발의 개자도 몰랐던 비전공자가 개발에 입문한 과정 💁‍♀️",
        "excerpt":"개발자에 입문한 계기 🚶‍♀️ 나는 태생부터 무언가에 몰입하기를 좋아했다. 고등학교 시절에는 책읽기, 대학교 시절에는 피아노에 몰두했었다. 대학교를 졸업하고도 무언가에 몰두할 것이 필요했었는데, 그게 바로 개발 공부였다. 우연히 알게된 개발의 시작은 퇴근하고 취미삼아 HTML, CSS으로 웹사이트를 만드는 것이었다. 생활코딩을 보며 서툴게나마 만들어 본 나의 첫번째 웹 사이트다. 지금보면 정말 허접하고 별...","categories": ["Chat"],
        "tags": ["Developer"],
        "url": "/chat/develop/",
        "teaser": null
      },{
        "title": "[Django] Django Custom Command",
        "excerpt":"Django Management Command는 python manage.py shell, python manage.py migrate 와 같이 우리가 장고를 사용할 때 자주 사용하는 명령어를 말한다. 우리는 이 Django Command를 Custom하여 원하는 동작을 원하는 명령어로 커스텀하여 만들어 줄 수 있다. custom command 만들기 원하는 app 폴더 밑에 management 폴더를 만들고 그 밑에 commands 폴더를 만든다. 앱이름/management/commands 이런...","categories": ["TIL"],
        "tags": ["Python","Django"],
        "url": "/til/custom-command/",
        "teaser": null
      },{
        "title": "[Docker] Django + MySQL 환경 구성하기",
        "excerpt":"docker 설치완료를 가정하고 진행해보겠습니다. mac os 환경에서 진행되었습니다. Django 프로젝트를 만들어주고 프로젝트 폴더안에 Dockerfile과 docker-compose.yml 파일을 생성해줍니다. 참고로, Docker-Compose로 도커 컨테이너를 자동 생성한 후, DockerFile로 생성한 컨테이너 안에 자동으로 세팅 작업까지 돌아갈 수 있도록 할 수 있습니다. Django 프로젝트 폴더 구조 . ├── Dockerfile ├── README.md ├── __pycache__ │   └──...","categories": ["TIL"],
        "tags": ["Python","Django","MySQL","Docker"],
        "url": "/til/docker/",
        "teaser": null
      }]
