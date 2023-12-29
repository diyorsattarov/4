cmake_minimum_required(VERSION 3.10)
project(beast-service)

file (GLOB APP_FILES
  include/beast.hpp
  src/http_session.cpp
  include/http_session.hpp
  src/listener.cpp
  include/listener.hpp
  main.cpp
  include/net.hpp
  src/shared_state.cpp
  include/shared_state.hpp
  src/websocket_session.cpp
  include/websocket_session.hpp
)

source_group ("" FILES ${APP_FILES})

add_executable (beast-service
    ${APP_FILES}
    ${BOOST_BEAST_FILES}
)

target_link_libraries(beast-service pthread ${Boost_SYSTEM_LIBRARY} )

set_property(TARGET beast-service PROPERTY FOLDER "beast-service")